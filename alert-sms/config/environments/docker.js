const baseConfig = require('../base');

const config = {
    ...baseConfig,
    db: {
        ...baseConfig.db,
        poolSize: 5,
        host: 'pim-mongo'
    },
    fs: {
        ...baseConfig.fs,
        host: 'pim-fs'
    },
    servicesUrl: {
        users: 'http://pim-user:3000',
        auth: 'http://pim-user:3000',
        permissions: 'http://pim-user:3000',
        roles: 'http://pim-user:3000',
        positions: 'http://pim-user:3000',
        branches: 'http://pim-branch:3000',
        companies: 'http://pim-company:3000',
        notification: 'http://pim-notification:3000',
        cities: 'http://pim-cities:3000'
    },
};

module.exports = config;
