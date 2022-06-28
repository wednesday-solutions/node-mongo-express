import { authMiddlewareFunc } from 'server/middlewares/auth/utils';
import { paths } from 'server/middlewares/auth/paths';
import { SCOPE_TYPE } from 'utils/constants';
import { isEqual } from 'lodash';

jest.mock('server/middlewares/auth/utils', () => ({
    authMiddlewareFunc: jest.fn()
}));

const testPaths = [
    {
        path: '/assign-roles',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'PUT'
    },
    {
        path: '/roles',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'POST'
    },
    {
        path: '/stores',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'POST'
    },
    {
        path: '/aggregate/order-amount',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'GET'
    },
    {
        path: '/orders',
        method: 'POST'
    },
    {
        path: '/orders/:_id',
        method: 'GET'
    },
    {
        path: '/orders',
        method: 'GET'
    },
    {
        path: '/referenced-orders',
        method: 'GET'
    },
    {
        path: '/unsharded-orders',
        method: 'GET'
    },
    {
        path: '/unsharded-referenced-orders',
        method: 'GET'
    },
    {
        path: '/stores',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        hasCustomAuth: true
    },
    {
        path: '/stores/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        hasCustomAuth: true
    },
    {
        path: '/stores/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'PATCH',
        hasCustomAuth: true
    },

    {
        path: '/stores/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'DELETE',
        hasCustomAuth: true
    },
    {
        path: '/store-products',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'POST',
        hasCustomAuth: true
    },
    {
        path: '/store-products',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        hasCustomAuth: true
    },
    {
        path: '/store-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        hasCustomAuth: true
    },
    {
        path: '/store-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'DELETE',
        hasCustomAuth: true
    },
    {
        path: '/suppliers',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'POST'
    },
    {
        path: '/suppliers/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        hasCustomAuth: true
    },
    {
        path: '/suppliers',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        hasCustomAuth: true
    },
    {
        path: '/suppliers/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'PATCH',
        hasCustomAuth: true
    },
    {
        path: '/suppliers/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'DELETE',
        hasCustomAuth: true
    },
    {
        path: '/supplier-products',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'POST',
        hasCustomAuth: true
    },
    {
        path: '/supplier-products',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        hasCustomAuth: true
    },
    {
        path: '/supplier-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        hasCustomAuth: true
    },
    {
        path: '/supplier-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'PATCH',
        hasCustomAuth: true
    },
    {
        path: '/supplier-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'DELETE',
        hasCustomAuth: true
    }
];
describe('paths', () => {
    it('check if all the paths are present', async () => {
        let i = 0;
        function checkIfPathMatches(path, testPath) {
            return path.path.toUpperCase() === testPath.path.toUpperCase();
        }
        function checkIfMethodMatches(path, testPath) {
            return path.method.toUpperCase() === testPath.method.toUpperCase();
        }
        function checkIfScopesMatch(path, testPath) {
            return isEqual(path.scopes, testPath.scopes);
        }
        await Promise.all(
            testPaths.map(async testPath => {
                let foundPath = false;
                await Promise.all(
                    paths.map(async path => {
                        if (
                            checkIfMethodMatches(path, testPath) &&
                            checkIfPathMatches(path, testPath) &&
                            checkIfScopesMatch(path, testPath)
                        ) {
                            foundPath = true;

                            if (testPath.hasCustomAuth) {
                                path.authMiddleware(
                                    { params: {}, user: {}, body: {} },
                                    {},
                                    () => {}
                                );
                                expect(
                                    authMiddlewareFunc
                                ).toHaveBeenCalledTimes(++i);
                            }
                        }
                    })
                );
                expect(foundPath).toBe(true);
            })
        );
    });
});
