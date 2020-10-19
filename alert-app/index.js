const cron = require('cron').CronJob;
const Alert = require('./lib/Alert');
const Email = require('./lib/EmailService');
const SmsService = require('./lib/SmsService');
const config = require('config');
const job  = config.get('job');
const indices  = config.get('indices');
const client = Alert.init();
const transporter = Email.init();

console.log(indices);

async function getAlerts (){

    for (const key in indices){

        for (const secondKey in indices[key]) {

            const data = await Alert.getUnReadAlertsFromElastic(client, indices[key][secondKey]);

            const hits = data.body.hits.hits;

            if(hits.length){
                console.log("<=========>",hits);

                await Email.sendAlertViaEmailToClient(transporter, JSON.stringify(hits));

                // await SmsService.sendAlertsViaSms('hello world');

            }
        }

    }


}

getAlerts();

// new cron(
//     job.time, //this means every Saturday at 00:00 AM reset the leader board
//     async function () {
//         getAlerts();
//     },
//     null,
//     true,
//     'Asia/Tehran'
// );


console.log('up and runnig');
