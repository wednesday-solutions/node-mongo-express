const { checkSchema } = require('express-validator');
export default checkSchema({
    totalPrice: {
        in: ['body'],
        errorMessage: 'totalPrice must be present',
        toFloat: true
    }
});
