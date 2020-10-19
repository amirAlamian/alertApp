const {
    receiver,
    template,
    sender,
    transaction,
    _id

} = require('./smsProperties');

class SendSmsRequest{
    constructor({ Validator, props }){
        this.Validator = Validator;
        this.props = props;
        this.schema = {
            type: 'object',
            additionalProperties: false,
            require: [ '_id', 'template', 'receiver', 'transaction' ],
            properties: {
                receiver,
                template,
                sender,
                _id,
                transaction
            }
        };
    }


    validate = async () => {
        await this.Validator.validate('sms', this.props, this.schema);
    }

    async authorize() {
        return true;
    }
}


module.exports = SendSmsRequest;
