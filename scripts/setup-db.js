const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres.wqxgaqmbmvrwyjotvjcz:WwCtz6BZnA5h0Vh7@aws-0-eu-north-1.pooler.supabase.com:6543/postgres"
});

const setupDB = async () => {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL.");

    const createBookingsTable = `
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        req_id VARCHAR(50) UNIQUE NOT NULL,
        venue_id VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        slot_time VARCHAR(50) NOT NULL,
        user_name VARCHAR(255),
        org_num VARCHAR(50),
        email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        type VARCHAR(50) DEFAULT 'public',
        reason TEXT,
        booked_at BIGINT NOT NULL
      );
    `;
    await client.query(createBookingsTable);
    console.log("Created 'bookings' table.");

    // We can also create venues if we want, but for now we'll stick to static venues + DB bookings.
    // The CMS modifies venues. Let's create a venues table too!
    const createVenuesTable = `
      CREATE TABLE IF NOT EXISTS venues (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url TEXT,
        capacity INTEGER,
        price INTEGER,
        features JSONB,
        accessibility JSONB,
        rules JSONB,
        contact TEXT
      );
    `;
    await client.query(createVenuesTable);
    console.log("Created 'venues' table.");

  } catch (err) {
    console.error("Error setting up DB:", err);
  } finally {
    await client.end();
  }
};

setupDB();
