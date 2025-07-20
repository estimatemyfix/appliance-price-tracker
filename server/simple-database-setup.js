const { Pool } = require('pg');

// Simple, crash-proof database setup
async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not found - skipping database setup');
    return { success: false, message: 'No DATABASE_URL' };
  }

  let pool;
  try {
    console.log('🏗️  Starting database setup...');
    
    // Create connection pool
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 5
    });

    // Test connection first
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    client.release();

    // Create basic tables only - keep it simple
    console.log('🏗️  Creating basic tables...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        brand VARCHAR(100),
        model_number VARCHAR(200),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS retailers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        domain VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Basic tables created');

    // Insert minimal sample data - no complex operations
    console.log('🌱 Adding sample data...');
    
    try {
      await pool.query(`
        INSERT INTO retailers (name, domain) VALUES
        ('Amazon', 'amazon.com'),
        ('Best Buy', 'bestbuy.com'),
        ('Home Depot', 'homedepot.com')
        ON CONFLICT (domain) DO NOTHING;
      `);

      await pool.query(`
        INSERT INTO products (name, brand, model_number, image_url) VALUES
        ('Samsung Refrigerator', 'Samsung', 'RF23M8070SR', 'https://images.samsung.com/sample.jpg'),
        ('LG Washing Machine', 'LG', 'WM3900HWA', 'https://gscs.lge.com/sample.jpg'),
        ('KitchenAid Mixer', 'KitchenAid', 'KSM75WH', 'https://kitchenaid.com/sample.jpg')
        ON CONFLICT DO NOTHING;
      `);
    } catch (insertError) {
      console.log('⚠️  Sample data insert failed (this is OK):', insertError.message);
    }

    console.log('✅ Database setup completed successfully!');
    return { success: true, message: 'Database setup complete' };

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    return { success: false, message: error.message };
  } finally {
    if (pool) {
      try {
        await pool.end();
        console.log('🔌 Database connection closed');
      } catch (closeError) {
        console.log('⚠️  Error closing database:', closeError.message);
      }
    }
  }
}

module.exports = { setupDatabase }; 