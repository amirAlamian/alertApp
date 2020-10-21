to run this service just follow this steps:

1) create an ENV file and copy all of information in ENV.example into it.

2) in the ENV file, put your local ip address in SERVER_URL

3) if you wanna use apm server, put apm server's uri in APM_SERVER_URL then choose a name for your service name and put it in front of APM_SERVER_KEY_PIM_SMS

3.1) if your apm server use a secret token, put it in APM_SERVER_SECRET_TOKEN

4) if you are using apache kafka in your service for serving messages, you should go to this alert_sms/config/base.js and change interfaces(true for enabling and false for disabling)
