import { checkSchema } from 'express-validator';
import { SCOPE_TYPE } from 'utils/constants';

export default checkSchema({
    name: {
        in: ['body'],
        errorMessage: 'name must be present',
        isIn: {
            options: [
                [
                    SCOPE_TYPE.SUPER_ADMIN,
                    SCOPE_TYPE.ADMIN,
                    SCOPE_TYPE.STORE_ADMIN,
                    SCOPE_TYPE.SUPPLIER_ADMIN
                ]
            ],
            errorMessage: 'Invalid role name.'
        },
        isString: true
    },
    description: {
        in: ['body'],
        errorMessage: 'description must be present',
        isString: true
    }
});
