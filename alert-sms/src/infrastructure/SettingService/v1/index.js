const rp = require('request-promise');

class SettingService {

    constructor({ config }){
        this.config = config;
        this.smsDetails = {};
        this.smsServiceAuthUrl;
    }

    async getSettingGroupList(groupList) {
        const options = {
            method: 'GET',
            uri: `http://${this.config.setting.host}:${this.config.setting.port}/api/v${this.config.setting.version}/admin/settings/list`,
            qs: {
                groupList,
            },
            json: true,
        };
        const data = await rp(options);
        return data.data.setting;
    }
    init = async () => {
        this.getSettingGroupList([
            'magfa',

        ])
            .then((data) => {
                this.smsDetails = data;
            })
            .catch((err) => {
                this.smsDetails = this.config.sms;
            });

    };
    getWeb = () => this.config.web;

    getVersion = () => this.config.version;

    getKafka = () => {
        return {
            kafkaHost: 'kafka:9092',
            autoConnect: true,
            sasl: {
                mechanism: 'plain',
                username: '',
                password: '',
            },
        };
    };

    getEnv = () => {
        return {
            env: this.config.env,
            production: this.config.production,
        };
    };



}

module.exports = SettingService;
