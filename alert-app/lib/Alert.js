const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

const config = require('config');

const  alert  = config.get('alert');

class Alert{


    init =  () => {
        const client = new Client({

            node: `${alert.host}:${alert.port}`,
            auth: {
                username: alert.auth[0].username,
                password: alert.auth[0].password
            },
            ssl: {
                ca: fs.readFileSync(alert.ssl[0].ca),
                key: fs.readFileSync(alert.ssl[0].key),
                cert: fs.readFileSync(alert.ssl[0].cert),
                rejectUnauthorized: false
            }
        });

        return client;
    }


    getUnReadAlertsFromElastic = async (client, index) => {

        const data =  await client.search({
            index: index,
            body: {
                query: {

                    match: { 'isReaded': false }

                }
            }
        });
        await this.#sendReadDataResponseToElastic(client, index);
        return data;
    }

    #sendReadDataResponseToElastic = async (client, index) => {

        return await client.updateByQuery({
            index: index,
            body: {
                script: {
                    source: 'ctx._source.isReaded = true ',
                    lang: 'painless'
                },
                query: {
                    match: {
                        isReaded: false
                    }
                }
            }
        });
    }

}


module.exports = new Alert;
