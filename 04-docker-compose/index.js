import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/", async function (request, reply) {
  reply.send({ hello: "world" });
});

// Run the server!
// set host to 0.0.0.0 to listen for all requests, not just localhost
fastify.listen({ port: 80, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
