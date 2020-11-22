const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

const config = require('config');

const alert = config.get('alert');

class Alert {
    init = () => {
        const client = new Client({
            node: `${alert.host}:${alert.port}`,
            auth: {
                username: alert.auth[0].username,
                password: alert.auth[0].password,
            },
            ssl: {
                ca: fs.readFileSync(alert.ssl[0].ca),
                key: fs.readFileSync(alert.ssl[0].key),
                cert: fs.readFileSync(alert.ssl[0].cert),
                rejectUnauthorized: false,
            },
        });

        return client;
    };

    getUnReadAlertsFromElastic = async (client, index) => {
        const data = await client.search({
            index,
            body: {
                query: {
                    match: { isReaded: false },
                },
            },
        });
        await this.#sendReadDataResponseToElastic(client, index);
        return data;
    };
    getUnReadSpecialAlertsFromElastic = async (
        client,
        index,
        containerName
    ) => {
        const data = await client.search({
            index,
            body: {
                size: 100,
                _source: ['monitor.status', '@timestamp', 'isReaded'],
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    'agent.type': 'heartbeat',
                                },
                            },
                            {
                                match: {
                                    'monitor.name': `${containerName}`,
                                },
                            },
                            {
                                exists: {
                                    field: 'monitor.status',
                                },
                            },
                        ],
                        must_not: [
                            {
                                exists: {
                                    field: 'isReaded',
                                },
                            },
                        ],
                    },
                },
                sort: [
                    {
                        '@timestamp': {
                            order: 'desc',
                        },
                    },
                ],
            },
        });
        await this.#sendReadSpecialDataResponseToElastic(
            client,
            index,
            containerName
        );
        return data;
    };
    getAllContainersNames = async (client, index) => {
        return await client.search({
            index,
            body: {
                size: 0,
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    'agent.type': 'heartbeat',
                                },
                            },
                            {
                                exists: {
                                    field: 'monitor.status',
                                },
                            },
                        ],
                    },
                },
                aggs: {
                    containerNames: {
                        terms: {
                            field: 'url.domain',
                            size: 100,
                        },
                    },
                },
            },
        });
    };
    getHardDiskStatus = async (client, index) => {
        const data = await client.search({
            index,
            body: {
                query: {
                    bool: {
                        must_not: [
                            {
                                exists: {
                                    field: 'isReaded',
                                },
                            },
                        ],
                    },
                },
                sort: [
                    {
                        date: {
                            order: 'desc',
                        },
                    },
                ],
            },
        });
        this.#sendReadHardStatusDataToElastic(client, index);
        return data;
    };
    getAuditAlertsFromElastic = async (client, index) => {
        const data = await client.search({
            index,
            body: {
                query: {
                  bool: {
                    must: [
                      {
                        match: {
                          "service.type": "system"
                        }
                      }
                    ],
                    must_not: [
                      {
                        exists: {
                          field: "isReaded"
                        }
                      }
                    ]
                  }
                },
                sort: [
                  {
                    "@timestamp": {
                      order: "desc"
                    }
                  }
                ]
              }
        }); 
        this.#sendReadAuditResponseToElastic(client, index);
        return data;
    }
    #sendReadDataResponseToElastic = async (client, index) => {
        return await client.updateByQuery({
            index,
            body: {
                script: {
                    source: 'ctx._source.isReaded = true ',
                    lang: 'painless',
                },
                query: {
                    match: {
                        isReaded: false,
                    },
                },
            },
        });
    };
    #sendReadSpecialDataResponseToElastic = async (
        client,
        index,
        containerName
    ) => {
        return await client.updateByQuery({
            index,
            body: {
                _source: 'monitor.status',
                script: {
                    source: 'ctx._source.isReaded=true',
                    lang: 'painless',
                },
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    'agent.type': 'heartbeat',
                                },
                            },
                            {
                                match: {
                                    'monitor.name': `${containerName}`,
                                },
                            },
                            {
                                exists: {
                                    field: 'monitor.status',
                                },
                            },
                        ],
                    },
                },
                sort: [
                    {
                        '@timestamp': {
                            order: 'desc',
                        },
                    },
                ],
            },
        });
    };
    #sendReadHardStatusDataToElastic = async (client, index) => {
        return await client.updateByQuery({
            index,
            body: {
                script: {
                    source: 'ctx._source.isReaded = true',
                    lang: 'painless',
                },
                query: {
                    match_all: {},
                },
            },
        });
    };
    #sendReadAuditResponseToElastic = async (client,index) => {
        return await client.updateByQuery({
            index,
            body: {
                script: {
                    source: 'ctx._source.isReaded = true',
                    lang: 'painless',
                },
                query: {
                    match: {
                        "service.type": "system"
                      }
                },
            },
        });
    };
    
}

module.exports = new Alert();
