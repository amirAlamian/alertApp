const BaseUseCase = require('./BaseUseCase');

class SendSmsUseCase extends BaseUseCase {
    constructor({ SendSmsRequest, props, locale, SmsService }){
        super();
        this.request = SendSmsRequest;
        this.props = props;
        this.locale = locale;
        this.SmsService = SmsService;
        this.smsDetails = {};
    }


    execute = async () => {

        await super.execute();

        const response = await this.SmsService.sendSms(this.props); // send sms to user

        const data = this.#mergeResponseAndPropsObject(response, this.props);

        return data;

    }

    #mergeResponseAndPropsObject = (response, props) =>{
        return { response, ...props };
    }
}

module.exports = SendSmsUseCase;
