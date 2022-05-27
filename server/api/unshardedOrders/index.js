import { generateFetchAllRequest } from 'api/requestGenerators';

export const fetchAllUnshardedOrders = async (router, model, validator) => {
    generateFetchAllRequest({ router, model });
};
