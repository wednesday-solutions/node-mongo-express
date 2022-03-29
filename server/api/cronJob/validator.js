const { checkSchema } = require('express-validator');
export default checkSchema({
    scheduleIn: {
        in: ['body'],
        errorMessage: 'scheduleIn must be present',
        isNumeric: true
    },
    message: {
        in: ['body'],
        errorMessage: 'message must be present',
        isString: true
    },
    queueName: {
        in: ['body'],
        errorMessage: 'Queue name is required'
    }
});
