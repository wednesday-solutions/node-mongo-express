import Bull from 'bull';
import moment from 'moment';
const queues = {};
// 1
export const QUEUE_NAMES = {
    SCHEDULE_JOB: 'scheduleJob',
    MIDNIGHT_CRON: 'midnightCron'
};
// 2
const CRON_EXPRESSIONS = {
    MIDNIGHT: '0 0  * * *'
};

export const QUEUE_PROCESSORS = {
    [QUEUE_NAMES.SCHEDULE_JOB]: (job, done) => {
        console.log(
            `${moment()}::Job with id: ${job.id} is being executed.\n`,
            {
                message: job.data.message
            }
        );
        done();
    },
    [QUEUE_NAMES.MIDNIGHT_CRON]: (job, done) => {
        console.log(
            `${moment()}::The MIDNIGHT_CRON is being executed at 12:00am`
        );
        done();
    }
};
// 3
export const initQueues = () => {
    console.log('init queues');
    Object.keys(QUEUE_PROCESSORS).forEach(queueName => {
        // 4
        queues[queueName] = getQueue(queueName);
        // 5
        queues[queueName].process(QUEUE_PROCESSORS[queueName]);
    });
    queues[QUEUE_NAMES.MIDNIGHT_CRON].add(
        {},
        { repeat: { cron: CRON_EXPRESSIONS.MIDNIGHT } }
    );
};
export const getQueue = queueName => {
    if (!queues[queueName]) {
        queues[queueName] = new Bull(
            queueName,
            `redis://${process.env.REDIS_DOMAIN}:${process.env.REDIS_PORT}`
        );
        console.log(
            'created queue: ',
            queueName,
            `redis://${process.env.REDIS_DOMAIN}:${process.env.REDIS_PORT}`
        );
    }
    return queues[queueName];
};
