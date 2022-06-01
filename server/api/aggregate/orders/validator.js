const { checkSchema } = require('express-validator');
export default checkSchema({
    date: {
        in: ['query'],
        isISO8601: {
            errorMessage: 'Add a valid date'
        }
    },
    category: {
        in: ['query'],
        optional: true,
        isString: {
            errorMessage: 'category must be of type string'
        }
    }
});
