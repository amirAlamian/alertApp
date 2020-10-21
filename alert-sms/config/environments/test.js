const baseConfig = require('../base');

const config = {
    ...baseConfig,
    db: {
        ...baseConfig.db,
        database: 'sms_test',
        poolSize: 5,
    },
    redis: {
        ...baseConfig.db,
        db: 1,
    },
};

module.exports = config;
