import config from 'config';
import { paths } from 'config/paths';

const checkRole = roles => (req, res, next) => {
    let roleArr = req.user[`${config().apiAudience}/roles`];
    const containsAll = roles.every(element => roleArr.indexOf(element) !== -1);
    if (!containsAll) {
        return res.json(403, { errors: ['Insufficient Scope'] });
    }
    let isAllowed = false;

    paths.map(route => {
        if (
            req.route.path === route.path &&
            req.method.toUpperCase() === route.method.toUpperCase()
        ) {
            route.scopes.forEach(ele => {
                if (roles.includes(ele)) {
                    isAllowed = true;
                    return;
                }
            });
        }
    });
    if (!isAllowed) {
        return res.json(403, { errors: ['Access denied!'] });
    }
    next();
};

module.exports = checkRole;
