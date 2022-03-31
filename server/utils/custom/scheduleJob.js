import moment from 'moment';
import { getQueue } from '../queue';

export const scheduleJob = (scheduleIn, message, queueName) =>
    getQueue(queueName)
        .add({ message: message }, { delay: scheduleIn })
        .then(job => {
            console.log(
                `${moment()}::Job with id: ${
                    job.id
                } scheduled in ${scheduleIn} milliseconds`
            );
            return { success: true };
        })
        .catch(err => ({ success: false }));
