import config from 'config';
import { ownershipBasedAccessControl } from './ownershipBasedAccessControl';

export const authMiddlewareFunc = async (req, model, configObj) =>
    await ownershipBasedAccessControl(
        req.user[`${config().apiAudience}/email`],
        model,
        configObj
    );
