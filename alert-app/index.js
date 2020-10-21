const cron = require('cron').CronJob;
const Alert = require('./src/services/Alert');
const Email = require('./src/services/EmailService');

const config = require('config');
const job  = config.get('job');
const indices  = config.get('indices');


const DBCreator = require('./src/DB/DBJsonCreator');
DBCreator();


// alert service starting
const client = Alert.init();
// Email service starting
const transporter = Email.init();
const controller = require('./src/controller');
controller(indices, client, transporter);
new cron(
    job.time, //this means every Saturday at 00:00 AM reset the leader board
    async function () {
        controller(indices, client, transporter);
    },
    null,
    true,
    'Asia/Tehran'
);

console.log('up and runnig');
