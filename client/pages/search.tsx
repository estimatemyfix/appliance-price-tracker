import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { apiCall, API_ENDPOINTS } from '@/config/api';

interface Product {
  id: number;
  name: string;
  brand: string;
  model_number: string;
  image_url: string;
  description: string;
  listings: Array<{
    retailer: {
      name: string;
      domain: string;
      logo_url: string;
    };
    current_price: {
      price: number;
      original_price: number;
      is_available: boolean;
    };
  }>;
}

interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (q && typeof q === 'string') {
      searchProducts(q);
    }
  }, [q]);

  const searchProducts = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(`${API_ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(query)}`);
      
      if (response.success) {
        setProducts(response.data.products);
        setTotal(response.data.total);
      } else {
        setError('Failed to search products');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!q) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Results</h1>
          <p className="text-gray-600">Please enter a search query.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Search Results for "{q}"
        </h1>
        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found for your search.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="space-y-6">
            <p className="text-gray-600">Found {total} results</p>
            
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 mb-4 md:mb-0 md:mr-6">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 md:h-32 object-contain bg-gray-50 rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h2>
                      <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
                      <p className="text-gray-600 mb-4">Model: {product.model_number}</p>
                      <p className="text-gray-700 mb-4">{product.description}</p>
                      
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Available at:</h3>
                        {product.listings.map((listing, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                            <div className="flex items-center">
                              <img
                                src={listing.retailer.logo_url}
                                alt={listing.retailer.name}
                                className="w-8 h-8 object-contain mr-3"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <span className="font-medium">{listing.retailer.name}</span>
                            </div>
                            
                            <div className="text-right">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-green-600">
                                  ${listing.current_price.price}
                                </span>
                                {listing.current_price.original_price > listing.current_price.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ${listing.current_price.original_price}
                                  </span>
                                )}
                              </div>
                              <span className={`text-sm ${listing.current_price.is_available ? 'text-green-600' : 'text-red-600'}`}>
                                {listing.current_price.is_available ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 