const Alert = require('../services/Alert');
const config = require('config');
const Email = require('../services/EmailService');
const SmsService = require('../services/SmsService');
const { contextGenerator } = require('../utils');
const hardDisk = config.get('hardDisk');
module.exports = async (client, transporter) => {
    const data = await Alert.getHardDiskStatus(client, 'hard-disk-metric').catch((err) => {
        console.log(err);
    });
    const hits = data.body.hits.hits;
    if (hits.length) {
        let hardDiskUsage = hits[0]._source.data;
        hardDiskUsage = hardDiskUsage.replace('\n', '');
        hardDiskUsage = hardDiskUsage.split(' ');
        const usage = hardDiskUsage.find((value) => {
            if (value.includes('%')) {
                return true;
            }
        });
        if (hardDisk.maxUsage < usage) {
            const { textEmail, textSms } = await hardDiskUsageServicesExecuter(
                usage
            );
            if (textEmail) {
                await Email.sendAlertViaEmailToClient(transporter, textEmail);
            }
            if (textSms) {
                await SmsService.sendAlertsViaSms(textSms);
            }
        }
    }
};

const hardDiskUsageServicesExecuter = async (usage) => {
    const hit = {
        _source: {
            context_reason: `hard disk usage is greater than a threshold of ${hardDisk.maxUsage} (current value is ${usage})`,
        },
    };
    const { email, sms } = contextGenerator(hit, 'metrics', {
        key: 'metrics',
        secondKey: 'hard disk usage',
    });
    return {
        textEmail: email.negative,
        textSms: sms.negative,
    };
};
