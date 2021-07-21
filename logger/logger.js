const { createLogger, format, transports,config } = require('winston');
const dotenv = require('dotenv');
const { combine, timestamp,json } = format;
dotenv.config({ path: '.env.example' });
const options = {
    development: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    },

    production: {
        level: 'info',
        handleExceptions: true,
        json: false,
        colorize: false
    }
}

let transport;
if(process.env.NODE_ENV=='development'){
    transport = [
        new transports.Console({
            level:"info",
            handleExceptions:true,
            json:true,
            colorize:true
        }
        )
    ]
}
else{
    transport = [
        new transports.File({
            level:"error",
            handleExceptions:true,
            json:false,
            colorize:false,
            filename:"error.log"
        }),
        new transports.File({
            level:"info",
            handleExceptions:true,
            json:false,
            colorize:false,
            filename:"combined.log"
        })
    ]
}

const logger = createLogger({
    levels: config.npm.levels,
    transports: transport,
    exitOnError: false,
    format:combine(timestamp(),json())
})

module.exports = logger