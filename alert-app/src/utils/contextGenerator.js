const config = require('config');
const context = config.get('context');
const moment = require('moment-timezone');
module.exports = (hit, alertType, keys) => {
    let text;

    switch (alertType) {

        case 'metrics': {
            hit._source.positiveReplace = `${hit._source.context_reason.split(' ')[0]} is safe`;
            text = replacer({ message: 'context_reason' }, alertType, hit, keys);
            break;
        }

        case 'Uptime': {
            text = replacer({ message: 'context_message' }, alertType, hit, keys);
            break;
        }

        case 'apm':{
            if(hit._source.transation_type){

                hit._source.context_message = 'transaction duration is high';
            }else{
                hit._source.context_message = 'An error has been detected';
            }

            text = replacer({ message: 'context_message' }, alertType, hit, keys);
            break;
        }

        case 'AuditBeat': {
            text = replacer({ message: 'message' }, alertType, hit, keys);
            break;
        }
        case 'docker': {
            hit._source.context_message = `${hit._source.containerName} is ${hit._source.monitor.status}`
            text = replacer({ message: 'context_message' }, alertType, hit, keys);
            break;
        }
    }

    return text;

};

function replacer (replaceToBe, contextType, replaceWith, keys) {
    const _Date = new Date();
    const DateNow = moment(_Date.now).tz('Asia/Tehran')
        .format('YYYY/MM/DD HH:mm:ss');
    const text  = { email: {}, sms: {} };
    if(context[contextType].email.negative){

        text.email.negative = context[contextType].email.negative
            .replace('%tags%', `${keys.key}: ${keys.secondKey}`)
            .replace(`%${replaceToBe.message}%`, replaceWith._source[replaceToBe.message])
            .replace('%timestamp%', DateNow)
            .replace('%ip%', replaceWith._source.ip || '');
    }
    if(context[contextType].email.positive){

        text.email.positive = context[contextType].email.positive
            .replace('%tags%', `${keys.key}: ${keys.secondKey}`)
            .replace('%timestamp%', DateNow)
            .replace('%usage%', replaceWith._source.positiveReplace)
            .replace('%ip%', replaceWith._source.ip || '');
    }
    if(context[contextType].sms.negative){

        text.sms.negative = context[contextType].sms.negative
            .replace('%tags%', `${keys.key}: ${keys.secondKey}`)
            .replace(`%${replaceToBe.message}%`, replaceWith._source[replaceToBe.message])
            .replace('%ip%', replaceWith._source.ip || '')
            .replace('%timestamp%', DateNow)
            .replace(/%space%/g, '\n');
    }
    if(context[contextType].sms.positive){

        text.sms.positive = context[contextType].sms.positive
            .replace('%tags%', `${keys.key}: ${keys.secondKey}`)
            .replace('%timestamp%', DateNow)
            .replace('%usage%', replaceWith._source.positiveReplace)
            .replace('%ip%', replaceWith._source.ip || '')
            .replace(/%space%/g, '\n');
    }
    return text;
}


