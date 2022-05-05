import { validationResult } from 'express-validator';
export const apiSuccess = (res, data) => {
    log.info('apiSuccess', { data });
    return res.send({ data }).status(200);
};

export const apiFailure = (res, error, status = 500) => {
    log.info('apiFailure', { error });
    return res.status(status).send({ error });
};

export const createValidatorMiddlewares = validator => {
    const middlewares = [];
    if (validator) {
        const checkValidtion = (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiFailure(res, errors.array(), 400);
            }
            return next();
        };
        middlewares.push(validator, checkValidtion);
    }
    return middlewares;
};
