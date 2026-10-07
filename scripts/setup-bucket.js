const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres.wqxgaqmbmvrwyjotvjcz:WwCtz6BZnA5h0Vh7@aws-0-eu-north-1.pooler.supabase.com:6543/postgres"
});

const createBucket = async () => {
  try {
    await client.connect();
    
    // Create bucket
    await client.query(`
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('venues', 'venues', true) 
      ON CONFLICT (id) DO NOTHING;
    `);
    
    // Create policies to allow public reading and inserting
    await client.query(`
      CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'venues');
    `).catch(e => console.log('Policy err', e.message));
    
    await client.query(`
      CREATE POLICY "Insert Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'venues');
    `).catch(e => console.log('Policy err', e.message));
    
    await client.query(`
      CREATE POLICY "Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'venues');
    `).catch(e => console.log('Policy err', e.message));
    
    await client.query(`
      CREATE POLICY "Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'venues');
    `).catch(e => console.log('Policy err', e.message));

    console.log("Bucket created successfully.");
  } catch (err) {
    console.error("Error setting up bucket:", err);
  } finally {
    await client.end();
  }
};

createBucket();
