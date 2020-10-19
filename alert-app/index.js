const cron = require('cron').CronJob;
const Alert = require('./lib/Alert');
const Email = require('./lib/EmailService');
const SmsService = require('./lib/SmsService');
const config = require('config');
const job  = config.get('job');
const client = Alert.init();
const transporter = Email.init();


async function getAlerts (){
    const data = await Alert.getUnReadAlertsFromElastic(client, 'test_index');
    const hits = data.body.hits.hits;

    if(hits.length){

        await Email.sendAlertViaEmailToClient(transporter, JSON.stringify('<h1>hello world</h1>'));

        // await SmsService.sendAlertsViaSms('hello world');

    }
}


new cron(
    job.time, //this means every Saturday at 00:00 AM reset the leader board
    async function () {
        getAlerts();
    },
    null,
    true,
    'Asia/Tehran'
);


console.log('up and runnig');
