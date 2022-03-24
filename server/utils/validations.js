const { checkSchema } = require('express-validator');

module.exports = {
    scheduleJob: checkSchema({
        scheduleIn: {
            in: ['body'],
            errorMessage: 'scheduleIn must be present'
        },
        message: {
            in: ['body'],
            errorMessage: 'message must be present',
            isString: true
        },
        queueName: {
            in: ['body'],
            errorMessage: 'queueName must be present',
            isString: true
        }
    })
};
