import { apiFailure, apiSuccess } from 'utils/apiUtils';
import { fetchAllPurchasedProducts } from '../utils';

export const fetchAllReferencedOrders = (router, model, _validator) => {
    router.get('/', async (req, res, next) => {
        try {
            const items = await fetchAllPurchasedProducts(model, req.query);
            return apiSuccess(res, items);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });
};
