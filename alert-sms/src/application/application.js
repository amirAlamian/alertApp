const regexPatterns = require('config/regexPatterns');


class Application {

    constructor({ server, SettingService, KafkaConsumer, KafkaProducer, regexChecker, config }){
        this.server = server;
        this.SettingService = SettingService;
        this.KafkaConsumer = KafkaConsumer;
        this.regexChecker = regexChecker;
        this.KafkaProducer = KafkaProducer;
        this.config = config;
    }

    async start(){

        this.regexChecker.check(regexPatterns);

        await this.SettingService.init();
        if(this.config.interfaces.kafka){
            await this.KafkaConsumer.start();

            await this.KafkaProducer.start();
        }


        this.http = await this.server.start();
    }
}


module.exports = Application;
