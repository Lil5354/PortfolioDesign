import http from 'http';

// We just query the DB directly to see if Users can be queried without hanging
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: "postgres://neondb_owner:npg_0ItvywJCB4RX@ep-tiny-mode-aqaqluvi-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT user_id, full_name, email FROM users LIMIT 1');
  console.log(res.rows);
  await client.end();
}
run();
