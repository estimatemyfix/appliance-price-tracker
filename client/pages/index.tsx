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
              "@type": "WebApplication",
              "name": "Appliance Price Tracker",
              "description": "Track appliance prices across major retailers and get price alerts when deals are available.",
              "url": "https://appliancetracker.com",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </Head>

      <Layout>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Search Bar */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchBar />
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Call to Action */}
        <CallToAction />
      </Layout>
    </>
  );
} 