import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import SearchBar from '@/components/SearchBar';

// Updated: Force Vercel redeploy - Railway backend is working perfectly!

interface FeaturedProduct {
  id: number;
  name: string;
  brand: string;
  image_url: string;
  min_price: number;
  max_price: number;
  retailer_count: number;
}

export default function Home() {
  const [featuredProducts] = useState<FeaturedProduct[]>([
    {
      id: 1,
      name: 'Samsung 24" Dishwasher',
      brand: 'Samsung',
      image_url: 'https://images.samsung.com/is/image/samsung/p6pim/us/dw80r9950us/gallery/us-dw80r9950us-dw80r9950us-aa-frontopendoor-thumb-409992276',
      min_price: 849.99,
      max_price: 1199.99,
      retailer_count: 3
    },
    {
      id: 2,
      name: 'LG French Door Refrigerator',
      brand: 'LG',
      image_url: 'https://gscs.lge.com/gscs/Images/LG_LRFVC2406S_01.jpg',
      min_price: 1299.99,
      max_price: 1599.99,
      retailer_count: 4
    },
    {
      id: 3,
      name: 'Whirlpool Electric Range',
      brand: 'Whirlpool',
      image_url: 'https://www.whirlpool.com/is/image/whirlpoolbrand/WFE975H0HZ_SS_Alt08?wid=570&hei=570&fmt=webp',
      min_price: 899.99,
      max_price: 1299.99,
      retailer_count: 5
    }
  ]);

  return (
    <Layout>
      <Head>
        <title>Home - Appliance Finder</title>
        <meta name="description" content="Find the best deals on appliances." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeroSection />
      <SearchBar />

      <section className="py-16">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-lg text-gray-800 mb-4">{product.brand}</p>
              <p className="text-lg text-gray-800">
                Price: ${product.min_price.toFixed(2)} - ${product.max_price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Retailers: {product.retailer_count}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}