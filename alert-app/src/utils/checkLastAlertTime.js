const moment = require('moment-timezone');


module.exports = (lastAlert) => {
    const _Date = new Date();
    const DateNow = moment(_Date.now).tz('Asia/Tehran')
        .format('HH:mm:ss')
        .split(':');
    const time = lastAlert._source.timestamp.split(':');

    const PassedHours = DateNow[0]-time[0];
    const PassedMinutes = DateNow[1]-time[1];

    if(PassedHours === 0){
        if(PassedMinutes >= 30){
            return true;
        }

        return false;
    } else if(PassedHours === 1){
        if(PassedMinutes >= -30){
            return true;
        }

        return false;
    }

    return true;
};
