const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const today = new Date().toISOString().slice(0, 10);
const fileTransport = new winston.transports.File({
    filename: path.join(logDir, 'log_' + today + '.log'),
    level: 'info',
});

fileTransport.on('error', (err) => {
    console.log(err);
});

const customFormat = winston.format.printf(
    ({ timestamp, level, message, ...meta }) => {
        let formattedMsg = "";
        if (Array.isArray(message)) {
            formattedMsg = message.map((item) => typeof item === "object" ? JSON.stringify(item, null, 2) : item)
                .join(" ");
        } else {
            formattedMsg = typeof message === "object" ? JSON.stringify(message, null, 2) : message;
        }
        return `${timestamp} ${level}: ${formattedMsg}`;
    }
);

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format((info) => {
            if (typeof info.message === 'undefined' && info[Symbol.for('splat')]) {
                info.message = [info.message, ...info[Symbol.for('splat')]];
            }
            return info;
        })(),
        customFormat
    ),
    transports: [fileTransport, new winston.transports.Console()],
});

module.exports = logger;


