const app = require('../backend/server');
const serverless = require('serverless-http');

module.exports = serverless(app);
