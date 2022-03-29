import checkRole from '../index';

describe('checkRole tests', () => {
    const req = {
        route: {
            path: '/assign-roles'
        },
        method: 'PUT',
        user: {
            'https://express-demo/roles': ['ADMIN', 'SUPER_ADMIN']
        }
    };
    const next = jest.fn();

    it('should ensure it return 403 when the user doesnot have right role to access the route', async () => {
        const roles = ['USER'];
        const mockResponse = () => {
            const res = {};
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };
        const res = mockResponse();
        const checkRoleMiddleware = checkRole(roles);
        checkRoleMiddleware(req, res, next);
        expect(res.json).toBeCalledWith(403, {
            errors: ['Insufficient Scope']
        });
    });
    it(`should ensure it return 403 when the user have right role but don't have to permission to access the route`, async () => {
        const roles = ['ADMIN'];
        const mockResponse = () => {
            const res = {};
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };
        const res = mockResponse();
        const checkRoleMiddleware = checkRole(roles);
        checkRoleMiddleware(req, res, next);
        expect(res.json).toBeCalledWith(403, {
            errors: ['Access denied!']
        });
    });

    it('should call next when the user has correct role and scope to access the route', async () => {
        const roles = ['SUPER_ADMIN'];
        const mockResponse = () => {
            const res = {};
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };
        const res = mockResponse();
        const checkRoleMiddleware = checkRole(roles);
        checkRoleMiddleware(req, res, next);
        expect(res.json).not.toBeCalled();
        expect(next).toBeCalled();
    });
});
