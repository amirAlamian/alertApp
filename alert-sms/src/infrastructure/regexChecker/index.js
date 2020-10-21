const safe = require('safe-regex');

class regexChecker {
    constructor({ logger }) {
        this.logger = logger;
    }
    check(regexObj) {
        this.logger.info('start regex checking...');
        let unsafe = 0;

        for (const regex in regexObj) {

            if (!safe(regexObj[regex])) {
                unsafe++;
                this.logger.error(`unsafe regex: ${regex}: ${regexObj[regex]}`);

            } else {
                this.logger.info(`safe regex:{regex}: ${regexObj[regex]} `);
            }
        }

        if (unsafe) {
            this.logger.error('Your regex is not safe');
        } else {
            this.logger.info('regex are safe.');
        }
    }
}

module.exports = regexChecker;
