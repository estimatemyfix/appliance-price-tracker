import { Request, Response } from 'express';
import { query } from '@/config/database';
import { 
  ApiResponse, 
  SearchProductsRequest, 
  SearchProductsResponse,
  ProductDetailResponse,
  CreatePriceAlertRequest 
} from '@/types';
import { ApiError } from '@/middleware/errorHandler';

// GET /api/products/search
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  const {
    query: searchQuery,
    category,
    brand,
    min_price,
    max_price,
    page = 1,
    limit = 20,
    sort = 'name'
  } = req.query as any as SearchProductsRequest;

  try {
    const offset = (page - 1) * limit;
    let whereConditions: string[] = [];
    let queryParams: any[] = [];
    let paramIndex = 1;

    // Build WHERE conditions dynamically
    if (searchQuery) {
      whereConditions.push(`(
        p.name ILIKE $${paramIndex} OR 
        p.model_number ILIKE $${paramIndex} OR 
        p.brand ILIKE $${paramIndex} OR 
        p.description ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${searchQuery}%`);
      paramIndex++;
    }

    if (category) {
      whereConditions.push(`c.slug = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }

    if (brand) {
      whereConditions.push(`p.brand ILIKE $${paramIndex}`);
      queryParams.push(brand);
      paramIndex++;
    }

    if (min_price) {
      whereConditions.push(`latest_price.price >= $${paramIndex}`);
      queryParams.push(min_price);
      paramIndex++;
    }

    if (max_price) {
      whereConditions.push(`latest_price.price <= $${paramIndex}`);
      queryParams.push(max_price);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? 
      `WHERE ${whereConditions.join(' AND ')}` : '';

    // Build ORDER BY clause
    let orderBy = 'p.name ASC';
    switch (sort) {
      case 'price_low':
        orderBy = 'latest_price.price ASC NULLS LAST';
        break;
      case 'price_high':
        orderBy = 'latest_price.price DESC NULLS LAST';
        break;
      case 'newest':
        orderBy = 'p.created_at DESC';
        break;
    }

    // Main query with price and retailer info
    const searchSQL = `
      WITH latest_prices AS (
        SELECT DISTINCT ON (pl.product_id) 
          pl.product_id,
          ph.price,
          ph.original_price,
          ph.is_available,
          r.name as retailer_name,
          r.logo_url as retailer_logo
        FROM product_listings pl
        JOIN price_history ph ON pl.id = ph.product_listing_id
        JOIN retailers r ON pl.retailer_id = r.id
        WHERE ph.is_available = true
        ORDER BY pl.product_id, ph.scraped_at DESC
      )
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        latest_price.price as current_price,
        latest_price.original_price,
        latest_price.is_available,
        latest_price.retailer_name,
        latest_price.retailer_logo,
        COUNT(*) OVER() as total_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN latest_prices latest_price ON p.id = latest_price.product_id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const result = await query(searchSQL, queryParams);
    const products = result.rows;
    const total = products.length > 0 ? parseInt(products[0].total_count) : 0;

    const response: ApiResponse<SearchProductsResponse> = {
      success: true,
      data: {
        products: products.map((row: any) => ({
          id: row.id,
          name: row.name,
          model_number: row.model_number,
          brand: row.brand,
          image_url: row.image_url,
          description: row.description,
          created_at: row.created_at || new Date(),
          updated_at: row.updated_at || new Date(),
          category: row.category_name ? {
            id: row.category_id,
            name: row.category_name,
            slug: row.category_slug
          } : undefined,
          listings: [{
            retailer: {
              id: row.retailer_id,
              name: row.retailer_name,
              domain: row.retailer_domain || '',
              logo_url: row.retailer_logo
            },
            current_price: {
              price: row.current_price,
              original_price: row.original_price,
              is_available: row.is_available
            }
          }]
        })) as any,
        total,
        page,
        limit
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Search products error:', error);
    throw new ApiError(500, 'Failed to search products');
  }
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  try {
    // Get product details
    const productSQL = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    const productResult = await query(productSQL, [productId]);

    if (productResult.rows.length === 0) {
      throw new ApiError(404, 'Product not found');
    }

    const product = productResult.rows[0];

    // Get all listings with current prices
    const listingsSQL = `
      SELECT 
        pl.*,
        r.name as retailer_name,
        r.logo_url as retailer_logo,
        r.affiliate_base_url,
        ph.price as current_price,
        ph.original_price,
        ph.is_available,
        ph.scraped_at as last_updated
      FROM product_listings pl
      JOIN retailers r ON pl.retailer_id = r.id
      LEFT JOIN LATERAL (
        SELECT price, original_price, is_available, scraped_at
        FROM price_history
        WHERE product_listing_id = pl.id
        ORDER BY scraped_at DESC
        LIMIT 1
      ) ph ON true
      WHERE pl.product_id = $1 AND pl.is_active = true
      ORDER BY ph.price ASC NULLS LAST
    `;
    const listingsResult = await query(listingsSQL, [productId]);

    // Get price history for the last 90 days
    const priceHistorySQL = `
      SELECT 
        ph.price,
        ph.original_price,
        ph.scraped_at,
        r.name as retailer_name
      FROM price_history ph
      JOIN product_listings pl ON ph.product_listing_id = pl.id
      JOIN retailers r ON pl.retailer_id = r.id
      WHERE pl.product_id = $1 
        AND ph.scraped_at >= NOW() - INTERVAL '90 days'
      ORDER BY ph.scraped_at ASC
    `;
    const priceHistoryResult = await query(priceHistorySQL, [productId]);

    // Get AI recommendation if available
    const recommendationSQL = `
      SELECT * FROM price_recommendations
      WHERE product_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const recommendationResult = await query(recommendationSQL, [productId]);

    const response: ApiResponse<ProductDetailResponse> = {
      success: true,
      data: {
        product: {
          ...product,
          category: product.category_name ? {
            id: product.category_id,
            name: product.category_name,
            slug: product.category_slug
          } : undefined,
          listings: listingsResult.rows.map((listing: any) => ({
            ...listing,
            retailer: {
              name: listing.retailer_name,
              logo_url: listing.retailer_logo,
              affiliate_url: listing.affiliate_base_url?.replace('{product_id}', listing.retailer_product_id)
            },
            current_price: listing.current_price,
            original_price: listing.original_price,
            is_available: listing.is_available,
            last_updated: listing.last_updated
          })),
          price_history: priceHistoryResult.rows,
          recommendation: recommendationResult.rows[0] || null
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get product error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to get product details');
  }
};

// POST /api/products/track
export const trackProduct = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const { product_id, target_price, alert_type = 'price_drop' }: CreatePriceAlertRequest = req.body;

  if (!product_id) {
    throw new ApiError(400, 'Product ID is required');
  }

  try {
    // Check if product exists
    const productCheck = await query('SELECT id FROM products WHERE id = $1', [product_id]);
    if (productCheck.rows.length === 0) {
      throw new ApiError(404, 'Product not found');
    }

    // Check if user already tracking this product
    const existingAlert = await query(
      'SELECT id FROM price_alerts WHERE user_id = $1 AND product_id = $2 AND is_active = true',
      [req.user.id, product_id]
    );

    if (existingAlert.rows.length > 0) {
      // Update existing alert
      const updateSQL = `
        UPDATE price_alerts 
        SET target_price = $1, alert_type = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `;
      const result = await query(updateSQL, [target_price, alert_type, existingAlert.rows[0].id]);
      
      res.json({
        success: true,
        message: 'Price alert updated successfully',
        data: result.rows[0]
      });
    } else {
      // Create new alert
      const insertSQL = `
        INSERT INTO price_alerts (user_id, product_id, target_price, alert_type)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const result = await query(insertSQL, [req.user.id, product_id, target_price, alert_type]);
      
      res.status(201).json({
        success: true,
        message: 'Product tracking started successfully',
        data: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Track product error:', error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Failed to track product');
  }
};

// GET /api/products/categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoriesSQL = `
      SELECT c.*, parent.name as parent_name
      FROM categories c
      LEFT JOIN categories parent ON c.parent_id = parent.id
      ORDER BY c.parent_id NULLS FIRST, c.name ASC
    `;
    const result = await query(categoriesSQL);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        parent: row.parent_name ? { name: row.parent_name } : null
      }))
    });
  } catch (error) {
    console.error('Get categories error:', error);
    throw new ApiError(500, 'Failed to get categories');
  }
};

// GET /api/products/:id/recommendations
export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  try {
    const recommendationSQL = `
      SELECT * FROM price_recommendations
      WHERE product_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const result = await query(recommendationSQL, [productId]);

    if (result.rows.length === 0) {
      // Generate new recommendation if none exists
      // This would typically call the AI service
      res.json({
        success: true,
        data: null,
        message: 'No recommendation available yet'
      });
    } else {
      res.json({
        success: true,
        data: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Get recommendations error:', error);
    throw new ApiError(500, 'Failed to get recommendations');
  }
};

// GET /api/products/:id/price-history
export const getPriceHistory = async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(req.params.id);
  const { retailer } = req.query;
  const days = parseInt(req.query.days as string) || 30;

  if (isNaN(productId)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  try {
    let priceHistorySQL = `
      SELECT 
        ph.price,
        ph.original_price,
        ph.scraped_at,
        r.name as retailer_name,
        r.logo_url as retailer_logo
      FROM price_history ph
      JOIN product_listings pl ON ph.product_listing_id = pl.id
      JOIN retailers r ON pl.retailer_id = r.id
      WHERE pl.product_id = $1 
        AND ph.scraped_at >= NOW() - INTERVAL '${days} days'
    `;
    
    const queryParams: (number | string)[] = [productId];
    
    if (retailer) {
      priceHistorySQL += ` AND r.domain = $2`;
      queryParams.push(retailer as string);
    }
    
    priceHistorySQL += ` ORDER BY ph.scraped_at ASC`;

    const result = await query(priceHistorySQL, queryParams);

    res.json({
      success: true,
      data: {
        price_history: result.rows,
        period_days: days,
        retailer_filter: retailer || null
      }
    });
  } catch (error) {
    console.error('Get price history error:', error);
    throw new ApiError(500, 'Failed to get price history');
  }
}; 