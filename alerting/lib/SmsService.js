const rp = require('request-promise');
const fs = require('fs');
const yaml = require('js-yaml');
const { sms } = yaml.safeLoad(fs.readFileSync('./config/setting.yml'), 'utf8').services;

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
        return await rp(options);
    }
}

module.exports =  new SmsService;
