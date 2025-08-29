import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import express from 'express';
import 'dotenv/config'; // Charge les variables d'environnement depuis le fichier .env

const app = express();
const PORT = process.env.PORT || 3002;  


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: 'API documentation for Authentification application',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/`,
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // Paths to files containing API docs (JSDoc comments)
};

const specs = swaggerJSDoc(options);

// --- Swagger UI Setup ---
export default (app) => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));    
}
