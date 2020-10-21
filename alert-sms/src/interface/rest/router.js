const express = require('express');
const { Router } = express;
const compression = require('compression');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec, swaggerOptions } = require('config/swagger');


const smsRouter = require('src/interface/rest/modules/v1/router');

const {
    httpLogger,
    monitorEventLoop,
    minorErrorHandler,
    requiredToken
} = require('src/interface/rest/middlewares');


const router = (container) => ({ logger, errorHandler, LocaleService }) => {
    const apiRouter = Router();

    apiRouter
        .use(cors()) // :TODO set options
        .use(httpLogger(logger))
        .use(express.json())
        .use(minorErrorHandler)
        .use(compression())
        .use(express.urlencoded({ extended: false }))
        .use(monitorEventLoop(logger))
        .use(requiredToken(container));

    apiRouter.use('/', smsRouter(container));
    // swagger
    apiRouter.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    apiRouter.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, swaggerOptions),
    );

    apiRouter.use('/swagger', (req, res) => {
        res.json(LocaleService.translate('swagger'));
    });
    apiRouter.use(errorHandler);

    return apiRouter;
};


module.exports = router;
