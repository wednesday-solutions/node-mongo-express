import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

const checkJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 25,
        jwksUri: 'https://dev-b0lcp7we.us.auth0.com/.well-known/jwks.json'
    }),
    issuer: 'https://dev-b0lcp7we.us.auth0.com/',
    algorithms: ['RS256']
});

module.exports = checkJwt;
