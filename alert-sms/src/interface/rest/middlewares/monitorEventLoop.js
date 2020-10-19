const toobusy = require('toobusy-js');

module.exports = (logger) => (req, res, next) => {
    if (toobusy()) {
        logger.error('event loop become too busy');
        // TODO add notifier E.G zabbix or some
    }

    next();
};
