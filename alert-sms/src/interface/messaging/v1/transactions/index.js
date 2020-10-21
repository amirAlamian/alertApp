const SendSmsTransaction = require('./SendSmsTranaction');


module.exports = (scope) => {
    const { props } = scope.cradle;


    switch (props.transaction) {
        case 'SEND_SMS':
            SendSmsTransaction(scope);
            break;
        default:
            break;
    }
};
