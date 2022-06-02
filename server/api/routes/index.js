import express from 'express';
import { login, loginValidator } from 'api/login';
import { roles, roleValidator } from 'api/roles';
import { assignRoles, assignRoleValidator } from 'api/assignRoles';
import { cronJob, cronJobValidator } from 'api/cronJob';
import {
    aggregatedOrderAmountValidator,
    fetchAggregatedOrderAmount
} from 'api/aggregate/orders';
import { checkJwt } from 'middlewares/auth';
import { rateLimiter as limiter } from 'middlewares/rateLimiter';

const router = express.Router();

const rateLimiter = limiter({
    windowMs: 0.5 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false
});

router.post('/login', loginValidator, rateLimiter, login);
router.post('/roles', rateLimiter, checkJwt, roleValidator, roles);
router.put('/assign-roles', checkJwt, assignRoleValidator, assignRoles);
router.post('/cron-job', cronJobValidator, cronJob);

router.get(
    '/aggregate/order-amount',
    checkJwt,
    aggregatedOrderAmountValidator,
    fetchAggregatedOrderAmount
);

module.exports = router;
