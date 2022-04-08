import express from 'express';
import { login, loginValidator } from 'api/login';
import { roles, roleValidator } from 'api/roles';
import { assignRoles, assignRoleValidator } from 'api/assignRoles';
import { cronJob, cronJobValidator } from 'api/cronJob';
import { createOrder, orderValidator } from 'api/orders';
import checkJwt from 'middlewares/Authenticate';
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
router.post(
    '/roles',
    rateLimiter,
    checkJwt,
    checkRole(['ADMIN']),
    roleValidator,
    roles
);
router.put(
    '/assign-roles',
    checkJwt,
    checkRole(['SUPER_ADMIN', 'ADMIN']),
    assignRoleValidator,
    assignRoles
);
router.post('/cron-job', cronJobValidator, cronJob);
router.post('/orders', orderValidator, createOrder);

module.exports = router;
