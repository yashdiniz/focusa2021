const dotenv = require('dotenv');
dotenv.config();

const port = process.env['PORT'];   // using FOCUSA legacy port for testing.
const graphiql = process.env['PRODUCTION'] == 'false';  // essentially, run graphiql at graphql endpoint

// the dev secret which will be used for most crypto operations.
const secret = process.env['SECRET'];

// the realm stores the DNS/server name.
const realm = process.env['REALM'];

module.exports = { port, graphiql, secret, realm };
