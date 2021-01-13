const getAlertController = require('./getAlertController');
const getSpecialAlertsController = require('./getSpecialAlertsController');
const getHardDiskStatus = require('./getHardDiskStatus')
const getAuditAlertController = require('./getAuditAlertController')
module.exports =  {
    getSpecialAlertsController,
    getHardDiskStatus,
    getAlertController,
    getAuditAlertController
};
