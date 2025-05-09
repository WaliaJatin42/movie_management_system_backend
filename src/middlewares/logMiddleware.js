// src/middlewares/logMiddleware.js

const logger = require('../utils/logger');

const isValidJsonThenParse = (string) => {
    try {
        return JSON.parse(string);
    } catch {
        return string;
    }
};

const logHttpMiddleware = (req, res, next) => {
    if (req.path.startsWith('/api-docs')) return next();

    logger.info(JSON.stringify({
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        body: req.body
    }, null, 2));

    const originalSend = res.send;
    res.send = function (body) {
        logger.info(JSON.stringify({
            status: this.statusCode,
            body: isValidJsonThenParse(body)
        }, null, 2));
        originalSend.call(this, body);
    };

    next();
};

module.exports = {
    logHttpMiddleware
};
