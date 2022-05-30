import { validationResult } from 'express-validator';
import { checkOwnership } from 'middlewares/custom';
import config from 'config';

export const apiSuccess = (res, data) => {
    log.info('apiSuccess', {});
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

export const authMiddlewareFunc = async (req, model, configObj) =>
    await checkOwnership(
        req.user[`${config().apiAudience}/email`],
        model,
        configObj
    );
