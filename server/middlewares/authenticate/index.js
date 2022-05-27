import config from 'config';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

const checkJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 25,
        jwksUri: `https://${config().domain}/.well-known/jwks.json`
    }),
    issuer: `https://${config().domain}/`,
    algorithms: ['RS256']
});

module.exports = checkJwt;
