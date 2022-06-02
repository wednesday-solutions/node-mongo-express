import { scheduleJob } from 'utils/custom/scheduleJob';
import { getQueue } from 'utils/queue';

describe('Schedule job tests', () => {
    const scheduleIn = 1000;
    const message = 'Sample message';
    const queueName = 'sampleQueue';
    it('should schedule a job after the given time', async () => {
        const res = await scheduleJob(scheduleIn, message, queueName);
        expect(res).toEqual({ success: true });
    });
    it('should return success false in case of an error', async () => {
        jest.spyOn(getQueue(queueName), 'add').mockImplementation(() =>
            Promise.reject('error')
        );
        const res = await scheduleJob(scheduleIn, message, queueName);
        expect(res).toEqual({ success: false });
    });
});
