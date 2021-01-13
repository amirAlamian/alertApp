const Alert = require('../services/Alert');
const config = require('config');
const Email = require('../services/EmailService');
const SmsService = require('../services/SmsService');
const { contextGenerator } = require('../utils');
const auditIndex = config.get('specialIndices').audit;
module.exports = async (client, transporter) => {
    const data = await Alert.getAuditAlertsFromElastic(client, auditIndex.darixo_login_user.index).catch((err) => {
        console.log(err);
    });
    const hits = data.body.hits.hits;
    if(hits.length){
        for(let i = 0 , n = hits.length ; i < n ; i++ ){
            const message = hits[i]._source.message;
            if (message) {
                const { textEmail, textSms } = await auditServicesExecuter(
                    hits[i]
                );
                if (textEmail) {
                    await Email.sendAlertViaEmailToClient(transporter, textEmail);
                }
                if (textSms) {
                    await SmsService.sendAlertsViaSms(textSms);
                }
            }
         
            
        }
    }
}

const auditServicesExecuter = async ( hit ) => {
    const { email, sms } = contextGenerator(hit, 'AuditBeat', {
        key: 'Audit Beat',
        secondKey: 'server login',
    });
    return {
        textEmail: email.negative,
        textSms: sms.negative,
    };
}