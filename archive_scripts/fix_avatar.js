import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgres://neondb_owner:npg_0ItvywJCB4RX@ep-tiny-mode-aqaqluvi-pooler.c-8.us-east-1.aws.neon.tech:5432/neondb?sslmode=require'
});

async function run() {
  await client.connect();
  const res1 = await client.query(`UPDATE users SET avatar_url = 'https://i.pravatar.cc/150' WHERE length(avatar_url) > 1000`);
  console.log(`Updated ${res1.rowCount} users with huge avatars`);
  
  const res2 = await client.query(`UPDATE artworks SET cover_image_url = 'https://placehold.co/600x400', original_cover_url = 'https://placehold.co/600x400' WHERE length(cover_image_url) > 1000 OR length(original_cover_url) > 1000`);
  console.log(`Updated ${res2.rowCount} artworks with huge cover_image_url`);
  
  await client.end();
}

run().catch(console.error);
