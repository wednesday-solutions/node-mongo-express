import express from 'express';
import {
    deleteItem,
    fetchItem,
    fetchItems,
    createItem,
    updateItem
} from '@api/utils';
import { apiFailure, apiSuccess } from '@utils/apiUtils';
import { Products } from '@models/products';
export default app => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            const product = await createItem(Products, req.body);
            return apiSuccess(res, product);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });

    router.get('/', async (req, res, next) =>
        fetchItems(Products, req.query)
            .then(products => apiSuccess(res, products))
            .catch(err => apiFailure(res, err.message))
    );

    router.get('/:_id', async (req, res, next) => {
        const { _id } = req.params;
        return fetchItem(Products, { _id })
            .then(product => apiSuccess(res, product))
            .catch(err => apiFailure(res, err.err));
    });

    router.put('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return updateItem(Products, { _id }, req.body)
            .then(products => apiSuccess(res, products))
            .catch(err => apiFailure(res, err.message));
    });

    router.delete('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return deleteItem(Products, { _id })
            .then(products => apiSuccess(res, products))
            .catch(err => apiFailure(res, err.err));
    });

    app.use('/products', router);
};
