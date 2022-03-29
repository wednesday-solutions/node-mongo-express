import { SCOPE_TYPE } from 'utils/constants';
export const paths = [
    {
        path: '/assign-roles',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'PUT'
    },
    {
        path: '/roles',
        scopes: [SCOPE_TYPE.ADMIN, SCOPE_TYPE.SUPER_ADMIN],
        method: 'POST'
    }
];
