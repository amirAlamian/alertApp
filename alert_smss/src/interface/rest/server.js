
const express = require('express');

class Server {
    constructor({ SettingService, logger, router }){
        this.http = null;
        this.web =   SettingService.getWeb();
        this.logger = logger;
        this.express = express();
        this.version = SettingService.getVersion();

        this.express.disable('x-powered-by');
        this.express.use(`/api/v${this.version}`, router);

        process.on('SIGTERM', this.shutDown);
        process.on('SIGINT', this.shutDown);
    }

    shutDown() {
        this.http.close(() => process.exit(0)); // shutdown server safely
        setTimeout(() => process.exit(1), 10000); // force server to shutdown after 5 seconds
    }

    async start(){
        process.on(
            'unhandledRejection',
            function (reason, promise) {
            //:FIXME
                this.logger.error(reason);
                this.logger.error(promise);
                process.exit(1);
            }.bind(this),
        );
        return await new Promise((resolve) => {
            this.http = this.express.listen(
                this.web.port,
                () => {
                    const { port } = this.http.address();
                    this.logger.info(
                        `[p ${process.pid}] Listening at port ${port}`
                    );
                    resolve(this.http);
                }
            );
        });

    }


    close() {
        this.shutDown();
    }
}

module.exports = Server;
