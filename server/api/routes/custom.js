import express from 'express';
import { login, loginValidator } from 'api/login';
import { roles, roleValidator } from 'api/roles';
import { assignRoles, assignRoleValidator } from 'api/assignRoles';
import { cronJob, cronJobValidator } from 'api/cronJob';
import checkJwt from 'middlewares/Authenticate';
import checkRole from 'middlewares/checkRole';

const router = express.Router();

router.post('/login', loginValidator, login);
router.post('/roles', checkJwt, checkRole(['ADMIN']), roleValidator, roles);
router.put(
    '/assign-roles',
    checkJwt,
    checkRole(['SUPER_ADMIN', 'ADMIN']),
    assignRoleValidator,
    assignRoles
);
router.post('/cron-job', cronJobValidator, cronJob);

module.exports = router;
