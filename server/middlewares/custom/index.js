import { set } from 'express-http-context';
import * as _ from 'lodash';
import message from 'utils/i18n/message';

module.exports = {
    /**
     * function to check if the requester is the owner of resource or not
     * @param {string} requesterEmail
     * @param {Model} model
     * @param {object} configObj
     * @returns boolean value
     */
    checkOwnership: async (requesterEmail, model, configObj) => {
        let resource = await model.findOne(configObj.condition);
        if (!resource) {
            throw new Error(message.RESOURCE_NOT_FOUND);
        }
        const resourceOwners = _.get(resource, configObj.ownerKey);
        const resourceOwnerEmail = Array.isArray(resourceOwners)
            ? resourceOwners.map(ele => ele.email)
            : [resourceOwners];
        if (!resourceOwnerEmail.includes(requesterEmail)) {
            return false;
        }
        // Block to set thecondition for findAll api
        if (configObj.findAll) {
            configObj.findAll.value = _.get(
                resource,
                configObj.resourceOwnershipPath
            );
            configObj.findAllCond = {
                [configObj.findAll.key]: configObj.findAll.value
            };
            set('condition', configObj.findAllCond);
        }

        return true;
    }
};
