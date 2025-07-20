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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Search Results for "{q}"
          </h1>
          {!loading && (
            <p className="text-gray-600">
              {total > 0 ? `Found ${total} results` : 'No results found'}
            </p>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Searching...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              onClick={() => typeof q === 'string' && searchProducts(q)}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.brand} • {product.model_number}
                  </p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {product.listings.length > 0 && (
                    <div className="space-y-2">
                      {product.listings.map((listing, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {listing.retailer.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-green-600">
                              ${listing.current_price.price}
                            </span>
                            {listing.current_price.original_price > listing.current_price.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${listing.current_price.original_price}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-1.001-6-2.709V15a6 6 0 1112 0v-2.709A7.962 7.962 0 0112 15z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-gray-600">Try searching for different keywords or check back later.</p>
          </div>
        )}
      </div>
    </Layout>
  );
} 