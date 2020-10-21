const {
    createContainer,
    asFunction,
    asClass,
    asValue,
    Lifetime,
} = require('awilix');

const config = require('config');
const app = require('src/application/application');
const router = require('src/interface/rest/router');
const server = require('src/interface/rest/server');
const errorHandler = require('src/interface/rest/errors/errorHandler');
const devErrorHandler = require('src/interface/rest/errors/devErrorHandler');
const LocaleService = require('src/infrastructure/internationalization/LocaleService');
const Validator = require('src/domain/Validator');
const SmsService = require('src/infrastructure/SmsService');
const SettingService = require('src/infrastructure/SettingService/v1');
const transactions = require('src/interface/messaging/v1/transactions');
const regexChecker = require('src/infrastructure/regexChecker');
const logger = require('src/infrastructure/logging/logger');
const utils = require('src/infrastructure/utils');
const colors = require('src/infrastructure/logging/colors');
const KafkaConsumer = require('src/interface/messaging/v1/kafka/consumers/kafkaConsumer');
const KafkaProducer = require('src/infrastructure/messaging/v1/kafka/kafkaProducer');
const container = createContainer();

container.register({
    app: asClass(app).singleton(),
    config: asValue(config),
    server: asClass(server).singleton(),
    regexChecker: asClass(regexChecker),
    logger: asFunction(logger).singleton(),
    LocaleService: asClass(LocaleService).singleton(),
    router: asFunction(router(container)).singleton(),
    Validator: asClass(Validator).scoped(),
    colors: asFunction(colors).singleton(),
    transactions: asValue(transactions),
    utils: asValue(utils),
    SmsService: asFunction(SmsService),
    KafkaConsumer: asClass(KafkaConsumer(container)).singleton(),
    KafkaProducer: asClass(KafkaProducer).singleton(),
    SettingService: asClass(SettingService).singleton(),
    errorHandler: asFunction(
        config.production ? errorHandler : devErrorHandler
    ).singleton(),
    locale: asValue('fa'), // set default before set inside scope
});

// register request models
container.loadModules([
    [
        'src/domain/v1/*.js',
        {
            register: asClass,
            lifetime: Lifetime.SCOPED,
        },
    ],
]);
// register use cases
container.loadModules([
    [
        'src/application/v1/*.js',
        {
            register: asClass,
            lifetime: Lifetime.SCOPED,
        },
    ],
]);

module.exports = container;
