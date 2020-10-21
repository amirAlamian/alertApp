const contextGenerator = require('./contextGenerator');
const checkLastAlertTime = require('./checkLastAlertTime');
const moment = require('moment-timezone');


module.exports =  (hits, lastAlerts, key, secondKey, indices) => {
    const _Date = new Date();
    const DateNow = moment(_Date.now).tz('Asia/Tehran')
        .format('HH:mm:ss');

    let textEmail;
    let textSms;
    const { email, sms } = contextGenerator(hits[hits.length-1], key, { key, secondKey });

    hits[hits.length -1]._source.timestamp = DateNow;

    if(!lastAlerts[secondKey]){

        lastAlerts[secondKey] = hits[hits.length - 1];
        textEmail = email.negative;
        textSms = sms.negative;
    }else{

        const sendingPermission =  checkLastAlertTime(lastAlerts[secondKey]);

        if(sendingPermission || indices[key][secondKey].isPrimary){

            textEmail = email.negative;
            textSms = sms.negative;
        }

    }

    return { textEmail, textSms };
};
