const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../openapi.json');

const setupSwagger = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/openapi.json', (_req, res) => res.json(swaggerDocument));
};

module.exports = { setupSwagger };
