import { SCOPE_TYPE } from 'utils/constants';

export const paths = [
    {
        path: '/me',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'GET'
    },
    {
        path: '/orders',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'POST'
    },
    {
        path: '/orders',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'GET'
    },
    {
        path: '/referenced-orders',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'GET'
    },
    {
        path: '/unsharded-orders',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'GET'
    },
    {
        path: '/unsharded-referenced-orders',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'GET'
    },
    {
        path: '/orders/:id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'PATCH'
    },
    {
        path: '/orders/:id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'DELETE'
    }
];
