const rp = require('request-promise');
const { createBase64String, castArrayToObject } = require('src/infrastructure/utils');

class SmsService{
    constructor(config){
        this.config = castArrayToObject(config);
        this.headers = {
            Authorization:
            `Basic ${createBase64String(`${this.config.SMS_USERNAME}/`
            +`${this.config.SMS_DOMAIN}}:${this.config.SMS_PASSWORD}`)}`
        };
    }


    GetFinancialBalance = async () =>{
        const options ={
            method: 'GET',
            uri: this.config.SMS_BALANCE_URI,
            headers: this.headers,
            json: true,

        };

        return rp(options);
    }

    sendSms = ({ receiver, template }) => {
        const options ={
            method: 'POST',
            uri: this.config.SMS_SEND_URI,
            headers: this.headers,
            body: {
                senders: [ this.config.SMS_SENDER_NUMBER ],
                messages: [ template ],
                recipients: receiver
            },
            json: true,
        };
        return rp(options);
    }
}

module.exports = SmsService;
