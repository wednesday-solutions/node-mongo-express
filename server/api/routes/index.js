import express from 'express';
import { login, loginValidator } from 'api/login';
import { roles, roleValidator } from 'api/roles';
import { assignRoles, assignRoleValidator } from 'api/assignRoles';
import { cronJob, cronJobValidator } from 'api/cronJob';
import checkJwt from 'middlewares/authenticate';
import checkRole from 'middlewares/checkRole';
import limiter from 'middlewares/rateLimiter';

const router = express.Router();

const rateLimiter = limiter({
    windowMs: 0.5 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false
});

router.post('/login', loginValidator, rateLimiter, login);
router.post('/roles', rateLimiter, checkJwt, checkRole, roleValidator, roles);
router.put(
    '/assign-roles',
    checkJwt,
    checkRole,
    assignRoleValidator,
    assignRoles
);
router.post('/cron-job', cronJobValidator, cronJob);

module.exports = router;
