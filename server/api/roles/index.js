import { validationResult } from 'express-validator';
import { apiFailure, apiSuccess } from 'utils/apiUtils';
import { clientCredentialsGrant, managementClient } from 'utils/auth0';
import roleValidator from './validator';

const roles = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { message: errors.errors[0].msg };
        }
        const { name, description } = req.body;
        const auth = await clientCredentialsGrant;
        const mgmtAuth0 = await managementClient(auth);
        const role = await mgmtAuth0.createRole({
            name,
            description
        });
        return apiSuccess(res, role);
    } catch (err) {
        return apiFailure(res, err.message);
    }
};

export { roles, roleValidator };
