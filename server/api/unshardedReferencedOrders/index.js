import { apiFailure, apiSuccess } from 'utils/apiUtils';
import { fetchAllPurchasedProducts } from '../utils';

export const fetchAllUnshardedReferencedOrders = (app, model, name) => {
    app.use('/', async (req, res, next) => {
        try {
            const items = await fetchAllPurchasedProducts(model, req.query);
            return apiSuccess(res, items);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });
};
