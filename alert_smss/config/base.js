const config = {
    web: {
        port: 3000,
        exposedPort: 8095,
    },
    interfaces: {
        kafka: false,
        rest: true
    },
    sms: [ {
        'key': 'SMS_PASSWORD',
        'value': 'UrdpfFOLO8qIMUSL',
    },
    {
        'key': 'SMS_USERNAME',
        'value': 'agah_41852',
    },
    {
        'key': 'SMS_DOMAIN',
        'value': 'magfa',
    },
    {
        'key': 'SMS_SENDER_NUMBER',
        'value': '+98300041852',

    },
    {
        'key': 'SMS_SEND_URI',
        'value': 'https://sms.magfa.com/api/http/sms/v2/send',
    },
    {
        'key': 'SMS_BALANCE_URI',
        'value': 'https://sms.magfa.com/api/http/sms/v2/balance',
    }, ],
    logstash: {
        host: 'logstash',
        port: 5000,
    },
    endpoint: 'sms',
    version: 1,
    serviceName: 'alert-sms'
};

module.exports = config;
