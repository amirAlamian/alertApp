class BaseUseCase {
    request;

    constructor() {}

    async execute() {
        if (this.request) {
            await this.request.validate();

            const result = await this.request.authorize();

            if (result !== true) {
                throw {
                    code: 'FORBIDDEN',
                    ...result,
                };
            }
        }
    }
}

module.exports = BaseUseCase;
