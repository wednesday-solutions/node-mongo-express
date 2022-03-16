import express from 'express';
import {
    deleteItem,
    fetchItem,
    fetchItems,
    createItem,
    updateItem
} from '@api/utils';
import { apiFailure, apiSuccess } from '@utils/apiUtils';
import { StoreProducts } from '@models/storeProducts';
export default app => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            const storeProcucts = await createItem(StoreProducts, req.body);
            return apiSuccess(res, storeProcucts);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });

    router.get('/', async (req, res, next) =>
        fetchItems(StoreProducts, req.query)
            .then(storeProducts => apiSuccess(res, storeProducts))
            .catch(err => apiFailure(res, err.message))
    );

    router.get('/:_id', async (req, res, next) => {
        const { _id } = req.params;
        return fetchItem(StoreProducts, { _id })
            .then(storeProcucts => apiSuccess(res, storeProcucts))
            .catch(err => apiFailure(res, err.err));
    });

    router.put('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return updateItem(StoreProducts, { _id }, req.body)
            .then(storeProducts => apiSuccess(res, storeProducts))
            .catch(err => apiFailure(res, err.message));
    });

    router.delete('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return deleteItem(StoreProducts, { _id })
            .then(storeProducts => apiSuccess(res, storeProducts))
            .catch(err => apiFailure(res, err.err));
    });

    app.use('/storeProducts', router);
};
