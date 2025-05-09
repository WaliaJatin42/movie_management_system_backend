const logger = require('../utils/logger');

// Fix: Use CommonJS syntax consistently or switch fully to ES modules
function validateRequest(schema, data, res, logPrefix) {
    const result = schema.safeParse(data);

    if (!result.success) {
        logger.warn(`${logPrefix} Validation failed:`, result.error.flatten().fieldErrors);

        res.status(400).json({
            message: 'Missing or invalid parameters',
            error: result.error.flatten().fieldErrors
        });
        return null;
    }

    return result.data;
}

module.exports = validateRequest;
