
const apm = require('elastic-apm-node');

// if(process.env.APM_SERVER_URL){

//     apm.start({
//         serviceName: process.env.APM_SERVER_KEY_PIM_USER,
//         // Use if APM Server requires a token
//         secretToken: process.env.APM_SERVER_SECRET_TOKEN,
//         serverUrl: `${process.env.APM_SERVER_URL}`,
//     });

// }

const container = require('src/container');

const app = container.resolve('app');

app.start()
    .then(() => {
        process.on('SIGINT', function () {
        //:TODO signal events doesn't work
            app.logger.info('<<<<<<<<<<<<<<<<<<<<SIGINT!>>>>>>>>>>>>>>>>>>');
            app.http.close();
        });
        app.http.on('close', () =>
            container
                .dispose()
                .then(() => {
                    app.logger.info(
                        '<<<<<<<<<<<<<<<<<<<<Container is disposed!>>>>>>>>>>>>>>>>>>'
                    );
                })
                .catch((error) => {
                    app.logger.error(error.stack);
                })
        );
    })
    .catch((error) => {
        if (error.error) {
        // eslint-disable-next-line no-console
            console.log(error.error); // incase of mongo error
        } else if (error.stack) {
        // eslint-disable-next-line no-console
            console.log(error.stack); // incase of js error
        }

        process.exit();
    });
