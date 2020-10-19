const statusCodes = require('src/interface/rest/constants/statusCodes');
const ok = require('src/interface/rest/responses/ok');
const fail = require('src/interface/rest/responses/fail');

module.exports = (container) => {
    const { SUCCESS, BAD_REQUEST } = statusCodes;

    const balance = async (req, res) =>{

        const { GetFinancialBalanceUseCase } = req.scope.cradle;

        const data = await GetFinancialBalanceUseCase.execute();

        if(!data.status){
            res.json(ok({ code: SUCCESS, message: 'success', data }));
        }else{
            res.json(fail({ code: BAD_REQUEST }));
        }

    };

    const sendSms = async (req, res) => {
        const { SendSmsUseCase } = req.scope.cradle;
        const data = await SendSmsUseCase.execute();

        if(!data.response.status){
            res.json(ok({ code: SUCCESS, message: 'success', data }));
        }else{
            res.json(fail({ code: BAD_REQUEST }));
        }
    };

    return {
        balance,
        sendSms
    };
};
