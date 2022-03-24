import authenticateToken from '../index';
import jwt from 'jsonwebtoken';
import * as utils from 'utils';

jest.mock('jsonwebtoken', () => ({
    verify: (token, accesskey, cb) => {
        cb();
    }
}));
describe('authentication tests', () => {
    const req = {
        headers: {
            authorization: null
        }
    };
    const next = jest.fn();
    const OLD_ENV = process.env;
    const keys = {
        ACCESS_TOKEN_SECRET: '4cd7234152590dcfe77e1b6fc52e84f4d30c06fddadd0dd2'
    };

    beforeEach(() => {
        jest.spyOn(utils, 'isTestEnv').mockReturnValue(false);
        process.env = { ...OLD_ENV, ...keys };
    });
    afterAll(() => {
        process.env = OLD_ENV;
    });

    it('should ensure it return 401 when no token is available', async () => {
        const mockResponse = () => {
            const res = {};
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };
        const res = mockResponse();
        authenticateToken(req, res, next);
        expect(res.json).toBeCalledWith(401, { errors: ['Token not found!'] });
    });

    it('should by-pass auth when the ENVIRONMENT_NAME=local', async () => {
        process.env.ENVIRONMENT_NAME = 'local';
        const res = {
            json: jest.fn()
        };

        authenticateToken(req, res, next);
        expect(res.json).not.toBeCalled();
        expect(next).toBeCalled();
    });
    it('should ensure it return 403 when an invalid token is passed', () => {
        const res = {
            json: jest.fn()
        };
        req.headers.authorization = 'Bearer confidential';

        jest.spyOn(jwt, 'verify').mockImplementationOnce(
            (token, accessToken, cb) => {
                cb(new Error());
            }
        );
        authenticateToken(req, res, next);
        expect(res.json).toBeCalledWith(403, {
            errors: ['Unauthorized Access!']
        });
    });
    it('should call next when valid jwt token is passed', () => {
        const res = {
            json: jest.fn()
        };
        const user = {
            email: 'doe@yopmail.com',
            role: 'USER'
        };
        req.headers.authorization = 'Bearer confidential';

        jest.spyOn(jwt, 'verify').mockImplementationOnce(
            (token, accessToken, cb) => {
                cb(null, user);
            }
        );
        authenticateToken(req, res, next);
        expect(next).toBeCalled();
    });

    it(`should ensure it return 401 when no token is available when header don't have authorization key`, async () => {
        req.headers = { Auth: '' };
        const mockResponse = () => {
            const res = {};
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };
        const res = mockResponse();
        authenticateToken(req, res, next);
        expect(res.json).toBeCalledWith(401, { errors: ['Token not found!'] });
    });
});
