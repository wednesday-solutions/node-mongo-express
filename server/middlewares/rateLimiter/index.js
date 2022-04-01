import rateLimit from 'express-rate-limit';

const rateLimiter = options => rateLimit(options);

module.exports = rateLimiter;
