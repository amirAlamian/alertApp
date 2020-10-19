'use strict';
const fs = require('fs');
const { createLogger, transports, format } = require('winston');
const ElasticsearchApm = require('@entropy/winston-elasticsearch-apm');
const apm = require('elastic-apm-node');

const { combine, timestamp, errors, simple, printf } = format;

if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

module.exports = ({ SettingService, colors }) => {
    const logger = createLogger({
        format: combine(timestamp(), errors({ stack: true }), simple()),
        maxsize: 100 * 1024, // 100mb
        exitOnError: false,
        transports: [
            new transports.File({
                filename: `logs/${SettingService.getEnv().env}.log`,
            }),
            new transports.File({
                filename: `logs/${SettingService.getEnv().env}-errors.log`,
                level: 'error',
            }),

            new ElasticsearchApm({ apm: apm })


        ],
    });

    if (!SettingService.getEnv().production) {
        const objectStringFormat = printf((info) => {

            const { level, stack } = info;
            let  { message } = info;

            if (message) {
                if (typeof message === 'object') {
                    message = JSON.stringify(message);
                }
            }

            switch (level) {
                case 'silly':
                    return colors.silly(`[${level}] ${message}`);

                case 'warn':
                    return colors.warn(`[${level}] ${message}`);

                case 'http':
                    return colors.http(`[${level}] ${message}`);

                case 'error':
                    return colors.error(`[${level}] ${message}\n ${(stack)? stack :''}`);

                case 'verbose':
                    return colors.verbose(`[${level}] ${message}`);

                case 'info':
                    return colors.info(`[${level}] ${message}`);

                case 'debug':
                    return colors.debug(`[${level}] ${message}`);
            }
        });
        logger.add(
            new transports.Console({
                format: combine(timestamp(), objectStringFormat),
            })
        );
    }

    return logger;
};
