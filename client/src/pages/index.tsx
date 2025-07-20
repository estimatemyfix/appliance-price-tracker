import Head from 'next/head';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CallToAction from '@/components/CallToAction';
import HowItWorks from '@/components/HowItWorks';

export default function Home() {
  return (
    <>
      <Head>
        <title>Appliance Price Tracker - Track Prices & Save Big</title>
        {/* Force Vercel redeploy - Railway backend working! */}
        <meta 
          name="description" 
          content="Track appliance prices across major retailers like Amazon, Home Depot, Lowe's & Best Buy. Get price alerts and AI recommendations to find the best deals on appliances." 
        />
        <meta name="keywords" content="appliance price tracker, appliance deals, price comparison, Amazon appliances, Home Depot appliances, Lowe's appliances, Best Buy appliances" />
        <meta property="og:title" content="Appliance Price Tracker - Track Prices & Save Big" />
        <meta property="og:description" content="Track appliance prices across major retailers and get price alerts when deals are available." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://appliancetracker.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Appliance Price Tracker - Track Prices & Save Big" />
        <meta name="twitter:description" content="Track appliance prices across major retailers and get price alerts when deals are available." />
        <link rel="canonical" href="https://appliancetracker.com" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Appliance Price Tracker",
              "url": "https://appliancetracker.com",
              "description": "Track appliance prices across major retailers and get price alerts when deals are available.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://appliancetracker.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>

      <Layout>
        {/* Hero Section */}
        <HeroSection />

        {/* Main Search Section */}
        <section className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Find the Best Appliance Deals
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Search for any appliance model or browse categories to compare prices 
              across major retailers and get AI-powered buying recommendations.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                placeholder="Search for appliances (e.g. Samsung refrigerator, KitchenAid mixer)"
                size="large"
                showSuggestions={true}
              />
            </div>

            {/* Quick category links */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                'Refrigerators',
                'Washers',
                'Dryers', 
                'Ranges',
                'Dishwashers',
                'Microwaves'
              ].map((category) => (
                <a
                  key={category}
                  href={`/search?category=${category.toLowerCase()}`}
                  className="inline-flex items-center px-4 py-2 bg-white text-primary-600 border border-primary-200 rounded-full text-sm font-medium hover:bg-primary-50 transition-colors"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Call to Action */}
        <CallToAction />

        {/* Trust Indicators */}
        <section className="py-16 bg-neutral-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Trusted by Smart Shoppers
              </h2>
              <p className="text-neutral-600">
                Join thousands of users saving money on appliances
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary-600">50K+</div>
                <div className="text-sm text-neutral-600">Products Tracked</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary-600">6</div>
                <div className="text-sm text-neutral-600">Major Retailers</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary-600">$2.5M</div>
                <div className="text-sm text-neutral-600">Total Savings</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary-600">15K+</div>
                <div className="text-sm text-neutral-600">Happy Users</div>
              </div>
            </div>

            {/* Retailer Logos */}
            <div className="mt-16">
              <h3 className="text-center text-sm font-medium text-neutral-500 mb-8">
                WE TRACK PRICES FROM
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-60">
                {[
                  { name: 'Amazon', domain: 'amazon.com' },
                  { name: 'Home Depot', domain: 'homedepot.com' },
                  { name: 'Lowes', domain: 'lowes.com' },
                  { name: 'Best Buy', domain: 'bestbuy.com' },
                  { name: 'Costco', domain: 'costco.com' },
                  { name: 'Wayfair', domain: 'wayfair.com' },
                ].map((retailer) => (
                  <div key={retailer.name} className="flex justify-center">
                    <img
                      src={`https://logo.clearbit.com/${retailer.domain}`}
                      alt={retailer.name}
                      className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
} 