const contextGenerator = require('./contextGenerator');

module.exports = (lastAlerts, key, secondKey) => {

    const { email, sms } = contextGenerator(lastAlerts[secondKey], key, { key, secondKey });

    lastAlerts[secondKey] = '';
    return { textEmail: email.positive, textSms: sms.positive };


};
