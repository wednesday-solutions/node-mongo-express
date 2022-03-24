import { cronJob } from 'api/cronJob';
import express from 'express';
import { scheduleJob } from 'utils/validations';
const router = express.Router();

router.post('/schedule-job', scheduleJob, cronJob);

module.exports = router;
