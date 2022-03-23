import includes from 'lodash/includes';
import { paths } from '@config/paths';

const checkAccess = (req, res, next) => {
    const scope = req.user.role;
    let isAllowed = true;
    paths.map(route => {
        if (
            req.route.path === route.path &&
            req.route.method.toUpperCase() === route.method.toUpperCase()
        ) {
            isAllowed = includes(route.scopes, scope);
        }
    });
    if (!isAllowed) {
        return res.json(403, { errors: ['Access denied!'] });
    }
    next();
};

export default checkAccess;
