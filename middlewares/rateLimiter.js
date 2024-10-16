const { rateLimit } = require('express-rate-limit');

module.exports = rateLimit({
    windowMs: 60 * 1000,
    max: 40,
    message: 'You have exceeded your 40 requests per minute limit.',
    headers: true
})