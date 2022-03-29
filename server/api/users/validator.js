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
    }
});
