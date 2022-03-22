import checkAccess from '../index';

describe('checkAccess tests', () => {
    const req = {
        route: {
            path: '/me',
            method: 'GET'
        },
        user: {
            role: 'INTERNAL_SERVICE'
        }
    };
    const next = jest.fn();

    it('should ensure it return 403 when the user doesnot have right scope to access the route', async () => {
        const mockResponse = () => {
            const res = {};
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };
        const res = mockResponse();
        checkAccess(req, res, next);
        expect(res.json).toBeCalledWith(403, { errors: ['Access denied!'] });
    });

    it('should call next when the user has correct scope to access the route', async () => {
        req.user.role = 'ADMIN';
        const mockResponse = () => {
            const res = {};
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };
        const res = mockResponse();
        checkAccess(req, res, next);
        expect(res.json).not.toBeCalled();
        expect(next).toBeCalled();
    });
});
