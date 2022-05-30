import config from 'config';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

const checkJwt = async (req, res, next) => {
    try {
        await jwt({
            secret: jwks.expressJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 25,
                jwksUri: `https://${config().domain}/.well-known/jwks.json`
            }),
            issuer: `https://${config().domain}/`,
            algorithms: ['RS256']
        })(req, res, (err, data) => {
            if (err) {
                res.send({ errors: [err] });
            }
            return next(err, data);
        });
    } catch (err) {
        console.log('error', { err });
    }
};

module.exports = checkJwt;
