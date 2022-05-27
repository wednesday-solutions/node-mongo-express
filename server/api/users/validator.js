import { SCOPE_TYPE } from 'utils/constants';

const { checkSchema } = require('express-validator');
export default checkSchema({
    firstName: {
        in: ['body'],
        errorMessage: 'firstName must be present',
        isString: true
    },
    lastName: {
        in: ['body'],
        errorMessage: 'lastName must be present',
        isString: true
    },
    email: {
        in: ['body'],
        isEmail: true,
        errorMessage: 'email must be present'
    },
    password: {
        in: ['body'],
        isLength: {
            errorMessage: 'Password should be at least 9 chars long',
            options: { min: 9 }
        },

        errorMessage: 'password must be present'
    },
    role: {
        in: ['body'],
        errorMessage: 'role must be present',
        isIn: {
            options: [
                [
                    SCOPE_TYPE.SUPER_ADMIN,
                    SCOPE_TYPE.STORE_ADMIN,
                    SCOPE_TYPE.SUPPLIER_ADMIN
                ]
            ],
            errorMessage: 'Invalid role name.'
        },
        isString: true
    }
});
