import config from 'config';
import jwt from 'express-jwt';
import { isEmpty } from 'lodash';
import jwks from 'jwks-rsa';
import { apiFailure } from 'utils/apiUtils';
import { SCOPE_TYPE } from 'utils/constants';
import message from 'utils/i18n/message';
import log from 'utils/logger';
import { paths } from './paths';

export const checkRole = async (req, res, next) => {
    try {
        const roleArr = req.user[`${config().apiAudience}/roles`];
        let isAllowed = false;
        let authMiddleware;
        const routePath = getRoutePath(req);
        paths.map(route => {
            if (
                routePath === route.path &&
                req.method.toUpperCase() === route.method.toUpperCase()
            ) {
                if (isEmpty(route.scopes)) {
                    isAllowed = true;
                } else {
                    route.scopes.forEach(ele => {
                        if (roleArr.includes(ele)) {
                            isAllowed = true;
                            if (route.authMiddleware) {
                                authMiddleware = route.authMiddleware;
                            }
                            return;
                        }
                    });
                }
            }
        });
        if (!isAllowed) {
            return apiFailure(res, message.ACCESS_DENIED, 403);
        } else if (
            authMiddleware &&
            !roleArr.includes(SCOPE_TYPE.SUPER_ADMIN)
        ) {
            const isResourceOwner = await authMiddleware(req, res, next);
            if (!isResourceOwner) {
                return apiFailure(res, message.ACCESS_DENIED, 403);
            }
            next();
        } else {
            next();
        }
    } catch (error) {
        return apiFailure(res, error.message, 400);
    }
};
function getRoutePath(req) {
    const path = req.route?.path || req.path;
    return req.baseUrl + (path === '/' ? '' : path);
}
export const checkJwt = (req, res, next) => {
    log.info('incoming request::', getRoutePath(req));
    let pathMatchFound = false;
    const routePath = getRoutePath(req);
    paths.map(route => {
        if (
            routePath === route.path &&
            req.method.toUpperCase() === route.method.toUpperCase()
        ) {
            pathMatchFound = true;
        }
    });
    // If this is a public API there is no matching entry in the path.js
    if (!pathMatchFound) {
        next();
        return;
    } else {
        return jwt({
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
                return next(err);
            }
            return checkRole(req, res, next);
        });
    }
};
