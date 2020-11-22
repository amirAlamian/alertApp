const Alert = require('../services/Alert');
const lastAlerts = require('../DB/lastAlerts.json');
const { positiveAlertGenerator, negativeAlertGenerator } = require('../utils');
const Email = require('../services/EmailService');
const SmsService = require('../services/SmsService');
const fs = require('fs');

module.exports  = async (indices, client, transporter) => {
    for (const key in indices){

        for (const secondKey in indices[key]) {
            const data = await Alert.getUnReadAlertsFromElastic(client, indices[key][secondKey].index).catch((err) => {
                console.log(err);
            });

            let hits = data.body.hits.hits;
            if(indices[key][secondKey].isPrimary){

                primaryServicesExecuter (hits, lastAlerts, key, secondKey, indices, transporter);

            }else{
                nonePrimaryServiceExecuter  (hits, key, secondKey, indices, transporter);

            }

        }

    }

};

const primaryServicesExecuter = async (hits, lastAlerts, key, secondKey, indices, transporter) => {
    if(hits.length){
        const negativeContext = negativeAlertGenerator(hits[hits.length -1], lastAlerts, key, secondKey, indices);
        const textEmail = negativeContext.textEmail;
        const textSms = negativeContext.textSms;

        if(textEmail){

            await Email.sendAlertViaEmailToClient(transporter, textEmail);
        }


        if(textSms){

            await SmsService.sendAlertsViaSms(textSms);
        }
    }
};

const nonePrimaryServiceExecuter = async (hits, key, secondKey, indices, transporter) => {
    let textEmail;
    let textSms;

    if(hits.length){
        const negativeContext = negativeAlertGenerator(hits[hits.length -1], lastAlerts, key, secondKey, indices );
        textEmail = negativeContext.textEmail;
        textSms = negativeContext.textSms;
        if(textSms){
            lastAlerts[secondKey] = hits[hits.length - 1];
        }
    }else if(lastAlerts[secondKey]){
        const positiveContext =  positiveAlertGenerator (lastAlerts, key, secondKey);
        textEmail = positiveContext.textEmail;
        textSms = positiveContext.textSms;
        lastAlerts[secondKey] = '';
    }

    fs.writeFileSync('./src/DB/lastAlerts.json', JSON.stringify(lastAlerts));

    if(textEmail){
        await Email.sendAlertViaEmailToClient(transporter, textEmail);
    }

    if(textSms){
        await SmsService.sendAlertsViaSms(textSms);
    }
};
