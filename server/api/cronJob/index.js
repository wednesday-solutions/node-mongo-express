import { apiFailure, apiSuccess } from 'utils/apiUtils';
import { scheduleJob } from 'utils/custom/scheduleJob';

export const cronJob = async (req, res, next) => {
    console.log('Inside cronJob');
    const { scheduleIn, message, queueName } = req.body;
    return scheduleJob(scheduleIn, message, queueName)
        .then(data => apiSuccess(res, data))
        .catch(err => apiFailure(res, err.err));
};
