'use strict';
const colors = require('colors');



module.exports= ()=>{
    colors.setTheme({
        silly: [ 'gray' ],
        warn: [ 'yellow' ],
        http: [ 'magenta' ],
        error: [ 'red' ],
        verbose: [ 'white' ],
        info: [ 'green' ],
        debug: [ 'blue' ],
    });


    return colors;
};
