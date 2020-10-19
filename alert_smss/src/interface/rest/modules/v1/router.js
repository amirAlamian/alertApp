const { Router } = require('express');
const controller = require('./controller');
const { requiredToken } = require('../../middlewares');

module.exports = (container) => {
    /**
     * @swagger
     * components:
     *   parameters:
     *      - name: accept-language
     *        in: header
     *        schema:
     *          type: string
     *          enum: [en,fa]
     *          default: en
     *        require: true
     */
    const { balance, sendSms } = controller(container);

    const router = Router();
    /**
     * @swagger
     *
     *  /financialBalance:
     *    get:
     *     tags: ['sms Service']
     *     description: get balance of sms system
     *     order: 1
     *     parameters:
     *       - $ref: '#/components/parameters/0'
     *     isExposable: false
     *     responses:
     *       200:
     *         description: your financial balance.
     *       404:
     *         description: not found
     *
     */
    router.get('/financialBalance', requiredToken(container), balance);
    /**
     * @swagger
     *
     *  /sendSms:
     *    post:
     *     tags: ['sms Service']
     *     description: send sms to user
     *     order: 1
     *     parameters:
     *       - $ref: '#/components/parameters/0'
     *     requestBody:
     *             content:
     *                 application/json:
     *                     examples:
     *                         testSms:
     *                             value:
     *                                receiver: 09214698677
     *                                template: hello
     *                     schema:
     *                         type: object
     *                         properties:
     *                            receiver:
     *                                require: true,
     *                                description: user's phone number
     *                                type: string
     *                            template:
     *                                require: true,
     *                                description: message context
     *                                type: string
     *     isExposable: false
     *     responses:
     *       200:
     *         description: your sms is sent.
     *       404:
     *         description: not found
     *
     */
    router.post('/sendSms', requiredToken(container), sendSms);

    return router;


};
