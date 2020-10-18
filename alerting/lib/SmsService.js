const rp = require('request-promise');

const config = require('config');

const  sms  = config.get('sms');

class SmsService {

    sendAlertsViaSms = async (template) => {
        const body = {
            receiver: sms.receiver,
            template

        };
        const options = {
            method: 'POST',
            uri: `http://${sms.host}:${sms.port}/api/v${sms.version}/${sms.URIs[0].sendSms}`,
            body,
            json: true,
        };

        if(sms.status) {
            return await rp(options);
        }
    }
}

module.exports =  new SmsService;
