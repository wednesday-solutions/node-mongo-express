import { validationResult } from 'express-validator';
import { apiFailure, apiSuccess } from 'utils/apiUtils';
import { clientCredentialsGrant, managementClient } from 'utils/auth0';
import assignRoleValidator from './validator';

const assignRoles = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { message: errors.errors[0].msg };
        }
        const { authId, role } = req.body;
        const auth = await clientCredentialsGrant;
        const mgmtAuth0 = await managementClient(auth);
        const rolesArr = await mgmtAuth0.getRole();
        const roleInfo = rolesArr.filter(rol => role.includes(rol.name));
        const roleIdArr = roleInfo.map(rol => rol.id);
        await mgmtAuth0.assignRolestoUser(
            {
                id: authId
            },
            { roles: [...roleIdArr] }
        );
        return apiSuccess(res, { message: 'Role updated successfully' });
    } catch (err) {
        return apiFailure(res, err.message);
    }
};

export { assignRoles, assignRoleValidator };
