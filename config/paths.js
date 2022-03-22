import { SCOPE_TYPE } from '@utils/constants';

export const paths = [
    {
        path: '/me',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'GET'
    }
];
