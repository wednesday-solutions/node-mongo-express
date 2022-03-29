import { apiFailure, apiSuccess } from 'utils/apiUtils';

export const fetchAllReferencedOrders = (app, model, validator) => {
    app.use('/', async (req, res, next) => {
        try {
            const items = await model
                .find()
                .select('purchasedProducts')
                .populate('purchasedProducts')
                .skip(req.query.page * req.query.limit)
                .limit(req.query.limit);
            return apiSuccess(res, items);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });
};
