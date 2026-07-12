import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgres://neondb_owner:npg_0ItvywJCB4RX@ep-tiny-mode-aqaqluvi-pooler.c-8.us-east-1.aws.neon.tech:5432/neondb?sslmode=require'
});

async function run() {
  await client.connect();
  const res = await client.query(`UPDATE artworks SET file_urls = ARRAY['https://placehold.co/600x400']::text[] WHERE length(file_urls::text) > 1000`);
  console.log(`Updated ${res.rowCount} artworks with huge file_urls`);
  await client.end();
}

run().catch(console.error);
