import { generateFetchAllRequest } from '@api/requestGenerators';

export const fetchAllUnshardedOrders = async (app, model, validator) => {
    generateFetchAllRequest(app, model);
};
