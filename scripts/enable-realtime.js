const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wqxgaqmbmvrwyjotvjcz:WwCtz6BZnA5h0Vh7@aws-0-eu-north-1.pooler.supabase.com:6543/postgres'
});

async function enableRealtime() {
  await client.connect();
  console.log("Connected");
  
  // Enable realtime on bookings
  try {
    await client.query(`
      alter publication supabase_realtime add table bookings;
    `);
    console.log("Realtime enabled on bookings table");
  } catch (e) {
    if (e.message.includes('already exists') || e.message.includes('already in publication')) {
      console.log("Already enabled");
    } else {
      console.error(e);
    }
  }

  await client.end();
}

enableRealtime();
