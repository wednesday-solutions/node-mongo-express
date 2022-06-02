import message from 'utils/i18n/message';
import * as utils from 'utils/apiUtils';
import { checkRole } from '../index';
import { ownershipBasedAccessControl } from '../ownershipBasedAccessControl';
jest.mock('../ownershipBasedAccessControl', () => ({
    ownershipBasedAccessControl: jest.fn()
}));

describe('checkRole tests', () => {
    let req;
    let next;
    let res;
    let apiFailureMock;
    let mocks;
    beforeEach(() => {
        process.env.API_AUDIENCE = 'https://node-express-demo';
        req = {
            route: {
                path: '/'
            },
            baseUrl: '/assign-roles',
            method: 'PUT',
            user: {
                'https://node-express-demo/roles': ['SUPER_ADMIN']
            }
        };
        next = jest.fn();
        const mockResponse = () => {
            const res = {};
            res.json = jest.fn().mockReturnValue(res);

            return res;
        };
        res = mockResponse();
        apiFailureMock = jest
            .spyOn(utils, 'apiFailure')
            .mockImplementationOnce((res, errMsg, status) => {});
        mocks = {
            ownershipBasedAccessControl
        };
    });

    const mockFunction = (object, methodName, returnValue) =>
        jest.spyOn(object, methodName).mockResolvedValueOnce(returnValue);

    it('should ensure it return 403 when the user doesnot have right role to access the route', async () => {
        req.user['https://node-express-demo/roles'] = 'STORE_ADMIN';
        await checkRole(req, res, next);
        expect(apiFailureMock).toBeCalledWith(res, message.ACCESS_DENIED, 403);
    });
    it(`should ensure it return 403 when the user have right role but is not the owner of the resource`, async () => {
        req.user['https://node-express-demo/roles'] = 'STORE_ADMIN';
        req.user[`https://node-express-demo/email`] = 'asser@wednesday.com';
        req.params = { _id: '62861b5be1897fc8b1d82360' };
        req.baseUrl = '/stores';
        req.route.path = '/:_id';
        req.method = 'GET';
        mockFunction(mocks, 'ownershipBasedAccessControl', false);
        await checkRole(req, res, next);
        expect(apiFailureMock).toBeCalledWith(res, message.ACCESS_DENIED, 403);
    });

    it(`should call next  when the user have right role and is  the owner of the resource`, async () => {
        req.user['https://node-express-demo/roles'] = 'STORE_ADMIN';
        req.user[`https://node-express-demo/email`] = 'asser@wednesday.com';
        req.params = { _id: '62861b5be1897fc8b1d82361' };
        req.baseUrl = '/stores';
        req.route.path = '/:_id';
        req.method = 'GET';
        mockFunction(mocks, 'ownershipBasedAccessControl', true);
        await checkRole(req, res, next);
        expect(next).toBeCalled();
    });

    it('should call next when the user has correct role and scope to access the route', async () => {
        req.user['https://node-express-demo/roles'] = 'SUPER_ADMIN';
        await checkRole(req, res, next);
        expect(next).toBeCalled();
    });

    it(`should return error from catch block`, async () => {
        const mockError = new Error('test');
        req.user['https://node-express-demo/roles'] = 'STORE_ADMIN';
        req.user[`https://node-express-demo/email`] = 'asser@wednesday.com';
        req.params = { _id: '62861b5be1897fc8b1d82360' };
        req.baseUrl = '/stores';
        req.route.path = '/:_id';
        req.method = 'GET';
        jest.spyOn(mocks, 'ownershipBasedAccessControl').mockImplementationOnce(
            () => {
                throw mockError;
            }
        );

        expect(async () => {
            await checkRole(req, res, next);
        }).rejects.toThrowError('test');
    });
});
