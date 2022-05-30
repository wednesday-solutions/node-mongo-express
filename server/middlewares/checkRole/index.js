import config from 'config';
import { paths } from 'config/paths';
import { apiFailure } from 'utils/apiUtils';
import { SCOPE_TYPE } from 'utils/constants';
import message from 'utils/i18n/message';

const checkRole = async (req, res, next) => {
    try {
        const roleArr = req.user[`${config().apiAudience}/roles`];
        let isAllowed = false;
        let authMiddleware;
        const routePath = req.baseUrl + req.route.path;
        paths.map(route => {
            if (
                routePath === route.path &&
                req.method.toUpperCase() === route.method.toUpperCase()
            ) {
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

module.exports = checkRole;
