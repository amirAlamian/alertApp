const cron = require('cron').CronJob;
const Alert = require('./src/services/Alert');
const Email = require('./src/services/EmailService');
const config = require('config');
const job = config.get('job');
const indices = config.get('indices');

const DBCreator = require('./src/DB/DBJsonCreator');
DBCreator();

// alert service starting
const client = Alert.init();
// Email service starting
const transporter = Email.init();

const {
    getSpecialAlertsController,
    getAlertController,
    getHardDiskStatus,
} = require('./src/controller');

new cron(
    job.ordinaryTime, 
    async function () {
        console.log('common job is running');
        getAlertController(indices, client, transporter);
    },
    null,
    true,
    'Asia/Tehran'
);

new cron(
    job.specialTime, 
    async function () {
        getSpecialAlertsController(client, transporter);
        console.log('container job is running');
    },
    null,
    true,
    'Asia/Tehran'
);

new cron(
    job.hardDiskTime, 
    async function () {
        getHardDiskStatus(client, transporter);
        console.log('hard disk job is running');
    },
    null,
    true,
    'Asia/Tehran'
);
console.log('up and runnig');
