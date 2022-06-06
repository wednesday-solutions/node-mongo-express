import supertest from 'supertest';
import app from 'server';
import { SWAGGER_DOCS_PATH } from 'utils/swagUtils';

describe('swagUtils tests', () => {
    it('should reguster swagger ui in express app', async () => {
        const res = await supertest(app).get(SWAGGER_DOCS_PATH);
        expect(res.statusCode).toBe(200);
    });
});
