const magfaSmsService = require('./magfaSmsService');

module.exports = ({ SettingService }) => {


    let domain;

    SettingService.smsDetails.map((value) => {
        if(value.key === 'SMS_DOMAIN'){
            domain = value.value;
        }
    });


    switch(domain){
        case 'magfa':{
            return new magfaSmsService(SettingService.smsDetails);
        }
    }



};
