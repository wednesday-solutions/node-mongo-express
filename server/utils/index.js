import fs from 'fs';
import mongoose from 'mongoose';
import { apiFailure } from './apiUtils';

export const isTestEnv = () =>
    process.env.ENVIRONMENT_NAME === 'test' || process.env.NODE_ENV === 'test';

export const getModelFiles = modelsFolderPath => {
    if (typeof modelsFolderPath !== 'string') {
        throw new Error('modelPathString is invalid');
    }
    return fs
        .readdirSync(modelsFolderPath)
        .filter(file => fs.lstatSync(modelsFolderPath + file).isFile());
};

export const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
        return apiFailure(res, { message: 'Invalid ObjectId' });
    }
    next();
};

export const validateSchema = model => (req, res, next) => {
    const doc = new model(req.body);
    doc.validate(function (err) {
        if (err) {
            return apiFailure(res, err.errors);
        }
        next();
    });
};

export const validateReqBody = model => (req, res, next) => {
    const validKeys = model.schema.obj;
    const keys = Object.keys(req.body);
    if (keys.length) {
        let isValid = true;
        for (let i = 0; i < keys.length; i++) {
            if (!validKeys[keys[i]]) {
                isValid = false;
                break;
            }
        }
        if (!isValid) {
            return apiFailure(res, {
                message: 'Request schema is invalid'
            });
        }
        next();
    } else {
        return apiFailure(res, {
            message: 'Request schema is invalid'
        });
    }
};
