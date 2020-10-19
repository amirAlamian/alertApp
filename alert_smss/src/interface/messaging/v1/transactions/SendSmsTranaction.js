module.exports = async (scope) => {
    const { SendSmsUseCase, KafkaProducer }= scope.cradle;

    const data = await SendSmsUseCase.execute();

    KafkaProducer.sendMessage('SMS_RESPONSE', data);
};
