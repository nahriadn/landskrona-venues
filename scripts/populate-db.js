const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: "postgresql://postgres.wqxgaqmbmvrwyjotvjcz:WwCtz6BZnA5h0Vh7@aws-0-eu-north-1.pooler.supabase.com:6543/postgres"
});

const populateDB = async () => {
  try {
    await client.connect();
    
    // Read venues.json
    const venuesPath = path.join(process.cwd(), 'src', 'data', 'venues.json');
    const venues = JSON.parse(fs.readFileSync(venuesPath, 'utf8'));

    for (const venue of venues) {
      const q = `
        INSERT INTO venues (id, name, description, image_url, capacity, price, features, accessibility, rules, contact)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING
      `;
      const values = [
        venue.id,
        venue.name,
        venue.description,
        venue.imageUrl || null,
        venue.capacity || 0,
        venue.price || 0,
        JSON.stringify(venue.features || []),
        JSON.stringify(venue.accessibility || []),
        JSON.stringify(venue.rules || []),
        venue.contact || ''
      ];
      await client.query(q, values);
      console.log('Inserted venue:', venue.id);
    }
    console.log("Venues populated successfully.");
  } catch (err) {
    console.error("Error populating DB:", err);
  } finally {
    await client.end();
  }
};

populateDB();
