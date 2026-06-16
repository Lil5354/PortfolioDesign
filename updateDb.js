import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: "postgres://neondb_owner:npg_0ItvywJCB4RX@ep-tiny-mode-aqaqluvi-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",
});

async function run() {
  await client.connect();
  console.log("Connected to Neon DB");

  try {
    await client.query('ALTER TABLE "Artworks" ADD COLUMN "OriginalCoverUrl" text NULL;');
    console.log("Added OriginalCoverUrl to Artworks");
  } catch (e) {
    console.log("Artworks alter error:", e.message);
  }

  try {
    await client.query('ALTER TABLE "Messages" ADD COLUMN "Status" text NULL;');
    console.log("Added Status to Messages");
  } catch (e) {
    console.log("Messages alter error:", e.message);
  }

  // Also check if Prisma created it with lowercase 'artworks'
  try {
    await client.query('ALTER TABLE artworks ADD COLUMN "original_cover_url" text NULL;');
    console.log("Added original_cover_url to artworks (lowercase)");
  } catch (e) {
    console.log("artworks (lowercase) alter error:", e.message);
  }

  try {
    await client.query('ALTER TABLE messages ADD COLUMN status text NULL;');
    console.log("Added status to messages (lowercase)");
  } catch (e) {
    console.log("messages (lowercase) alter error:", e.message);
  }

  await client.end();
}

run();
