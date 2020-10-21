const config = require('config');
const indices  = config.get('indices');
const DB = {};
const fs = require('fs');


module.exports = () => {

    if(!fs.existsSync('./src/DB/lastAlerts.json')){
        for (const key in indices){

            for (const secondKey in indices[key]) {
                DB[secondKey] = '';
            }
        }

    }else{
        const lastAlerts = JSON.parse(fs.readFileSync('./src/DB/lastAlerts.json'));

        for (const key in indices){

            for (const secondKey in indices[key]) {

                if(lastAlerts[secondKey]) {
                    DB[secondKey] = lastAlerts[secondKey];
                    continue;
                }

                DB[secondKey] = '';

            }
        }


    }

    fs.writeFileSync('./src/DB/lastAlerts.json', JSON.stringify(DB));

};
