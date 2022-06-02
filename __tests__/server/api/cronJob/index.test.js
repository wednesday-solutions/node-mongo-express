import supertest from 'supertest';
import app from 'server';
import * as job from 'utils/custom/scheduleJob';

describe('cronJob tests', () => {
    it('should throw error when correct parameters are not passed', async () => {
        const res = await supertest(app)
            .post('/cron-job')
            .set('Accept', 'application/json')
            .send({});
        expect(res.statusCode).toBe(500);
        expect(res.error.text).toEqual(
            '{"error":"scheduleIn must be present"}'
        );
    });

    it('should ensure it return 200 when called with correct parameters', async () => {
        const payload = {
            scheduleIn: 2000,
            message: 'This message should be consoled at the scheduled time',
            queueName: 'scheduleJob'
        };
        let apiRes = { data: { success: 'true' } };
        const spy = jest
            .spyOn(job, 'scheduleJob')
            .mockImplementationOnce(() => apiRes.data);
        const res = await supertest(app)
            .post('/cron-job')
            .set('Accept', 'application/json')
            .send(payload);
        expect(spy).toHaveBeenCalledWith(
            payload.scheduleIn,
            payload.message,
            payload.queueName
        );
        expect(res.body).toEqual(apiRes);
    });
});
