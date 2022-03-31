import { validationResult } from 'express-validator';
import { apiFailure, apiSuccess } from 'utils/apiUtils';
import { scheduleJob } from 'utils/custom/scheduleJob';
import cronJobValidator from './validator';

const cronJob = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { message: errors.errors[0].msg };
        }
        const { scheduleIn, message, queueName } = req.body;
        const data = await scheduleJob(scheduleIn, message, queueName);
        return apiSuccess(res, data);
    } catch (err) {
        console.log('I am inside try block');
        return apiFailure(res, err.message);
    }
};

export { cronJob, cronJobValidator };
