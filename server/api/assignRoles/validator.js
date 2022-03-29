import { checkSchema } from 'express-validator';
import { SCOPE_TYPE } from 'utils/constants';

export default checkSchema({
    authId: {
        in: ['body'],
        errorMessage: 'user auth0 id must be present',
        isString: true
    },
    role: {
        in: ['body'],
        errorMessage: 'role must be present',
        isIn: {
            options: [
                [
                    SCOPE_TYPE.SUPER_ADMIN,
                    SCOPE_TYPE.ADMIN,
                    SCOPE_TYPE.STORE_ADMIN,
                    SCOPE_TYPE.SUPPLIER_ADMIN
                ]
            ],
            errorMessage: 'Invalid role.'
        },
        isArray: true
    }
});
