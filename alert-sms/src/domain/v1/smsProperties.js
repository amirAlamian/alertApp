const { smsSenderPattern } = require('config/regexPatterns');

module.exports = {
    receiver: {
    },
    template: {
        type: 'string'
    },
    sender: {
        type: 'string',
        pattern: smsSenderPattern
    },
    _id: {
        type: 'number',
        minimum: 0
    },
    transaction: {
        type: 'string',
        enum: [ 'SEND_SMS' ]
    }
};
