const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Movie Manage,ent System API',
            version: '1.0.0',
            description: 'API documentation using Swagger',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: 'http://localhost:5000', // Adjust if needed
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/index.js', './src/docs/*.swagger.js'], // Path to your route files with Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger docs available at http://localhost:5000/api-docs`);
}
module.exports = swaggerDocs;
