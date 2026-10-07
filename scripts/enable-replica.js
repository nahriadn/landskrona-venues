const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wqxgaqmbmvrwyjotvjcz:WwCtz6BZnA5h0Vh7@aws-0-eu-north-1.pooler.supabase.com:6543/postgres'
});

async function enableReplica() {
  await client.connect();
  console.log("Connected");
  
  try {
    await client.query(`
      ALTER TABLE bookings REPLICA IDENTITY FULL;
    `);
    console.log("Replica identity full set on bookings table");
  } catch (e) {
    console.error(e);
  }

  await client.end();
}

enableReplica();
