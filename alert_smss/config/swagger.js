const swaggerJSDoc = require('swagger-jsdoc');
const config = require('config');

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'PIM SMS Management API',
            description: 'This is sms API for Agah PIM project.',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://${process.env.SERVER_URL}:${config.web.gatewayPort}/api/v${config.version}`,
            },
            {
                url: `http://${process.env.SERVER_URL}:${config.web.exposedPort}/api/v${config.version}`,
            },
        ],
    },
    // Path to the API docs
    apis: [
        'src/interface/rest/modules/v1/router.js',
        'src/interface/rest/modules/v1/*/*/router.js',
    ],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerOptions = {
    swaggerOptions: {
        docExpansion: 'none',
    },
};

module.exports = {
    swaggerSpec,
    swaggerOptions,
};
