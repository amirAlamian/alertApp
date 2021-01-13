const { asValue } = require('awilix');
const utf8 = require('utf8');

module.exports = (container) => (req, res, next) => {
    req.scope = container.createScope();
    req.scope.register({
        props: asValue({ ...req.body, ...req.params, ...req.query }),
        locale: asValue(req.headers['accept-language'])
    });

    next();
};
