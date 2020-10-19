class GetFinancialBalanceUseCase{

    constructor({ locale, SmsService }){
        this.locale = locale;
        this.SmsService = SmsService;
    }


    execute = async () => {

        return  await this.SmsService.GetFinancialBalance();
    }
}

module.exports = GetFinancialBalanceUseCase;
