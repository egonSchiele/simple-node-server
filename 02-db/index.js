import Fastify from "fastify";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "",
  port: "",
  user: "",
  password: "",
  database: "",
  // without this, we get an error since
  // the traffic is not encrypted
  ssl: false,
  /* 
  You may instead need:
  ssl:{
    require: false,
    rejectUnauthorized: false,
  }, */
});

const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/moods", async function (request, reply) {
  const res = await runQuery("SELECT * FROM moods");
  reply.send(res);
});

// Insert
// curl -X POST http://localhost:80/add -H "Content-Type: application/json" -d '{"token":"SOME_SECRET_TOKEN","mood":"good"}'

fastify.post("/add", async function (request, reply) {
  const body = request.body;
  const { mood, token } = body;
  if (token !== "SOME_SECRET_TOKEN") {
    reply.code(401).send("Unauthorized");
    return;
  }
  const now = new Date();
  const created_at = now.toISOString();

  const res = await runQuery(
    "INSERT INTO moods (mood, created_at) VALUES ($1, $2) RETURNING *",
    [mood, created_at]
  );
  reply.send(res);
});

// Run the server!
// set host to 0.0.0.0 to listen for all requests, not just localhost
fastify.listen({ port: 80, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

async function runQuery(query, params = []) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const res = await client.query(query, params);
    await client.query("COMMIT");
    return res.rows;
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
