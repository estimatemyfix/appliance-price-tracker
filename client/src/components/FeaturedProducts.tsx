export default function FeaturedProducts() {
  const featuredProducts = [
    {
      id: 1,
      name: 'Samsung 4-Door Flex French Door Refrigerator',
      model: 'RF23M8070SR',
      image: 'https://images.samsung.com/is/image/samsung/p6pim/us/rf23m8070sr/gallery/us-french-door-refrigerator-rf23m8070sr-rf23m8070sr-aa-frontsilver-206838623',
      currentPrice: 1699.99,
      originalPrice: 2299.99,
      savings: 600,
      savingsPercent: 26
    },
    {
      id: 2,
      name: 'KitchenAid Stand Mixer Artisan Series',
      model: 'KSM150PSER',
      image: 'https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/kitchenaid/en-us/marketing-content/site-assets/page-content/pinwheel/KSM150PSER_1.jpg',
      currentPrice: 279.99,
      originalPrice: 379.99,
      savings: 100,
      savingsPercent: 26
    },
    {
      id: 3,
      name: 'LG Top Load Washer with TurboWash',
      model: 'WT7800CW',
      image: 'https://gscs.lge.com/downloadFile?fileId=7mJROz7QZRaxfHCm2HTfpw',
      currentPrice: 699.99,
      originalPrice: 899.99,
      savings: 200,
      savingsPercent: 22
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Featured Deals
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Hot deals we're tracking right now - save hundreds on top-rated appliances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="card card-hover p-6">
              <div className="aspect-w-16 aspect-h-12 mb-4 overflow-hidden rounded-lg bg-neutral-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-500">{product.model}</p>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="price">${product.currentPrice}</span>
                  <span className="price-original">${product.originalPrice}</span>
                  <span className="badge badge-success">
                    {product.savingsPercent}% off
                  </span>
                </div>

                <div className="text-sm text-secondary-600 font-medium">
                  Save ${product.savings}
                </div>

                <button className="w-full btn btn-primary">
                  Track This Deal
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/search" className="btn btn-outline btn-lg">
            View All Deals
          </a>
        </div>
      </div>
    </section>
  );
} 