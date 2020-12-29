const port = 1896;   // using FOCUSA legacy port for testing.
const graphiql = true;  // essentially, run graphiql at graphql endpoint

// the dev secret which will be used for most crypto operations.
// IN PRODUCTION, it should be `process.env.secret` with an environment variable.
const secret = "b-3l][=08BOIHW[oH)#T)(HG{3-09g2p[i-u";

module.exports = { port, graphiql, secret };