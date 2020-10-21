const statusCodes = require('src/interface/rest/constants/statusCodes');
const fail = require('src/interface/rest/responses/fail');

const apm = require('index.js');

// eslint-disable-next-line no-unused-vars
module.exports = ({ logger }) => (err, req, res, next) => {
    const { LocaleService } = req.scope.cradle;
    logger.error(err);

    let errors;
    let message;
    let statusCode;

    switch (err.code) {
        case 'NOT_FOUND':
            message = LocaleService.translate(
                'generic.error.notFound',
                err.resource
            );
            statusCode = statusCodes.NOT_FOUND;
            break;
        case 'VALIDATION_ERROR':
            errors = err.errors;
            message = LocaleService.translate('generic.error.failed');
            statusCode = statusCodes.BAD_REQUEST;
            break;
        case 'FORBIDDEN':
            message = LocaleService.translate('generic.error.forbidden');
            statusCode = statusCodes.FORBIDDEN;
            break;
        default:
            apm().sendErrorToElastic(err);
            message = LocaleService.translate('generic.error.internalServer');
            statusCode = statusCodes.INTERNAL_SERVER_ERROR;
            break;
    }

    res.status(statusCode).json(fail(errors, message));
};
