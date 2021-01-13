const Alert = require('../services/Alert');
const { contextGenerator } = require('../utils');
const Email = require('../services/EmailService');
const SmsService = require('../services/SmsService');
const config = require('config');
const specialIndex = config.get('specialIndices');
module.exports = async (clinet, transporter) => {

    for (const key in specialIndex) {
        for (const secondKey in specialIndex[key]) {

            const data = await Alert.getAllContainersNames(
                clinet,
                specialIndex[key][secondKey].index
            ).catch((err) => {
                console.log(err);
            });

            const containerNames =
                data.body.aggregations.containerNames.buckets;

            containerNames.map(async (value) => {
                const data = await Alert.getUnReadSpecialAlertsFromElastic(
                    clinet,
                    specialIndex[key][secondKey].index,
                    value.key
                ).catch((err) => {
                    console.log(err);
                });

                const hits = data.body.hits.hits;

                if (hits.length) {
                    if (hits[0]._source.monitor.status === 'down') {

                        const { textEmail, textSms,} = await specialServicesExecuter(hits[0], key, secondKey, value);

                        if(textEmail){
                            await Email.sendAlertViaEmailToClient(transporter, textEmail);
                        }
                        if(textSms){
                            await SmsService.sendAlertsViaSms(textSms);
                        }
                    }
                }
            });
        }
    }
};

const specialServicesExecuter = async (hit, key, secondKey, value) => {
    hit._source.containerName = value.key;
    const { email, sms } = contextGenerator(hit, key, {
        key,
        secondKey,
    });
    return {
        textEmail: email.negative,
        textSms: sms.negative,
    };
};
