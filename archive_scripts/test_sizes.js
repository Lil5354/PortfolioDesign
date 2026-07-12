import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgres://neondb_owner:npg_0ItvywJCB4RX@ep-tiny-mode-aqaqluvi-pooler.c-8.us-east-1.aws.neon.tech:5432/neondb?sslmode=require'
});

async function run() {
  await client.connect();
  const res = await client.query(`SELECT user_id, length(avatar_url) FROM users ORDER BY length(avatar_url) DESC NULLS LAST LIMIT 5`);
  console.log('Top 5 avatar_url lengths:', res.rows);
  
  const res2 = await client.query(`SELECT artwork_id, length(cover_image_url), length(original_cover_url), length(file_urls::text) FROM artworks ORDER BY length(file_urls::text) DESC NULLS LAST LIMIT 5`);
  console.log('Top 5 artworks file_urls lengths:', res2.rows);

  await client.end();
}

run().catch(console.error);
