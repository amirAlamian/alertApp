const contextGenerator = require('./contextGenerator');
const checkLastAlertTime = require('./checkLastAlertTime');
const moment = require('moment-timezone');

module.exports = (hit, lastAlerts = {}, key, secondKey, indices) => {
    const _Date = new Date();
    const DateNow = moment(_Date.now).tz('Asia/Tehran').format('HH:mm:ss');

    let textEmail;
    let textSms;
    const { email, sms } = contextGenerator(hit, key, { key, secondKey });
    hit._source.timestamp = DateNow;

    if (!lastAlerts[secondKey]) {
        lastAlerts[secondKey] = hit;
        textEmail = email.negative;
        textSms = sms.negative;
    } else {
        const sendingPermission = checkLastAlertTime(lastAlerts[secondKey]);
        if (sendingPermission || indices[key][secondKey].isPrimary) {
            textEmail = email.negative;
            textSms = sms.negative;
        }
    }

    return { textEmail, textSms };
};
