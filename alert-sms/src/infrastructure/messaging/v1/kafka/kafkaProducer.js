const { Producer, KafkaClient } = require('kafka-node');

class KafkaProducer {
    constructor({ logger, SettingService }) {
        this.logger = logger;
        this.SettingService = SettingService;
    }

    async start() {
        const { kafkaHost, autoConnect } = this.SettingService.getKafka();
        this.client = new KafkaClient({ kafkaHost, autoConnect });
        this.producer = new Producer(this.client);

        this.producer.on('ready', () => {
            return;
        });

        this.producer.on('error', (err) => {

            this.logger.error(`Error occurred on consumer group ${err}`);

            throw err;
        });
    }

    // messages can be one message
    async sendMessage(topic, messages, partition = 0) {
        return new Promise((resolve, reject) => {
            this.producer.send(
                [ { topic, partition, messages: JSON.stringify(messages) } ],
                (error, data) => {
                    if (error) {
                        this.logger.error(error);
                        reject(error);
                    } else {
                        this.logger.info(data);
                        resolve(data);
                    }
                }
            );
        });
    }
}

module.exports = KafkaProducer;
