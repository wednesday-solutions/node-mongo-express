const { checkSchema } = require('express-validator');
export default checkSchema({
    totalPrice: {
        // The location of the field, can be one or more of body, cookies, headers, params or query.
        // If omitted, all request locations will be checked
        in: ['body'],
        errorMessage: 'totalPrice must be present',
        isFloat: true,
        toFloat: true
    }
});
