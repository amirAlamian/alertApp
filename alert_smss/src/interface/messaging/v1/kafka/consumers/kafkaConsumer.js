const { Consumer, KafkaClient } = require('kafka-node');
const { asValue } = require('awilix');

module.exports = (container) =>
    class kafkaConsumer {
    defaultOptions = {
        encoding: 'utf8', //  is utf8, use 'buffer for binary data
        fromOffset: 0, //  default
        autoCommit: true,
    };
    client = null;
    consumer = null;
    defaultTopics = [ { topic: 'SMS', partition: 0 } ];
    constructor({ transactions, SettingService, logger }){
        this.logger = logger;
        this.SettingService = SettingService;
        this.transactions = transactions;
    }

    start = () => {
        const { kafkaHost, autoConnect } = this.SettingService.getKafka();
        this.client = new KafkaClient({
            kafkaHost,
            autoConnect,
        });

        this.consumer = new Consumer(
            this.client,
            this.defaultTopics,
            this.defaultOptions
        );
        this.consumer.on('error', (err) => {
            this.logger.error(`Error occurred on consumer group ${err}`);
            throw err;
        });
        this.consumer.on('message', (data) => {
            const scope = container.createScope();
            scope.register({ props: asValue(JSON.parse(data.value)) });
            this.transactions(scope);
        });
    }



    };


