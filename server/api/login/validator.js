import { checkSchema } from 'express-validator';

export default checkSchema({
    username: {
        in: ['body'],
        errorMessage: 'username must be present',
        isString: true
    },
    password: {
        in: ['body'],
        errorMessage: 'password must be present',
        isString: true
    }
});
