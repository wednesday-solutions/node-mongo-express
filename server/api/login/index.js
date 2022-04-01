import { validationResult } from 'express-validator';
import { apiFailure, apiSuccess } from 'utils/apiUtils';
import fetch from 'node-fetch';
import config from 'config';
import loginValidator from './validator';

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { message: errors.errors[0].msg };
        }
        const { username, password } = req.body;
        const payload = {
            username: username,
            password: password,
            client_id: config().frontendClientId,
            realm: config().connection,
            grant_type: config().frontendGrantType,
            audience: config().audience
        };
        const response = await fetch(`https://${config().domain}/oauth/token`, {
            method: 'post',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });
        const user = await response.json();
        return apiSuccess(res, user);
    } catch (err) {
        return apiFailure(res, err.message);
    }
};

export { login, loginValidator };
