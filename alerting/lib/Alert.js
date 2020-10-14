const { Client } = require('@elastic/elasticsearch');
const fs = require('fs')
const yaml = require('js-yaml');
const { alert }  = yaml.safeLoad(fs.readFileSync('./config/setting.yml'), 'utf8').services
class Alert{

    constructor(){}



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
          })   
          
          return client;
    }


    getUnReadAlertsFromElastic = async (client, indexName) => {

        const data =  await client.search({
            index: indexName,
            body: {
                query: {
                    
                    match: {"isReaded":false}
      
                }
            }
        })
        await this.#sendReadDataResponseToElastic(client , indexName);
        return data;
    }

    #sendReadDataResponseToElastic = async (client , indexName) => {

      return await client.updateByQuery({
            index: indexName,
            body: {
                script: {
                    source: "ctx._source.isReaded = true ",
                    lang: "painless"
                },
                query: {
                    match: {
                        isReaded: false
                    }
                }      
            }
        })
    }

}


module.exports = new Alert();