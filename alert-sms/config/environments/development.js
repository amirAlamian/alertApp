const baseConfig = require('../base');

const config = {
    ...baseConfig,
    db: {
        ...baseConfig.db,
        poolSize: 5
    }
};

module.exports = config;
