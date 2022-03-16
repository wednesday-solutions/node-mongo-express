import express from 'express';
import {
    deleteItem,
    fetchItem,
    fetchItems,
    createItem,
    updateItem
} from '@api/utils';
import { apiFailure, apiSuccess } from '@utils/apiUtils';
import { Orders } from '@models/orders';
export default app => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            const order = await createItem(Orders, req.body);
            return apiSuccess(res, order);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });

    router.get('/', async (req, res, next) =>
        fetchItems(Orders, req.query)
            .then(orders => apiSuccess(res, orders))
            .catch(err => apiFailure(res, err.message))
    );

    router.get('/:_id', async (req, res, next) => {
        const { _id } = req.params;
        return fetchItem(Orders, { _id })
            .then(order => apiSuccess(res, order))
            .catch(err => apiFailure(res, err.err));
    });

    router.put('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return updateItem(Orders, { _id }, req.body)
            .then(orders => apiSuccess(res, orders))
            .catch(err => apiFailure(res, err.message));
    });

    router.delete('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return deleteItem(Orders, { _id })
            .then(orders => apiSuccess(res, orders))
            .catch(err => apiFailure(res, err.err));
    });

    app.use('/orders', router);
};
