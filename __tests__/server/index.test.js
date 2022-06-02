import supertest from 'supertest';
import app from 'server';

describe('app tests', () => {
    it('should have GET router at /', async () => {
        const res = await supertest(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toContain(
            'node-express-mongo server at your service🖖'
        );
    });
});
