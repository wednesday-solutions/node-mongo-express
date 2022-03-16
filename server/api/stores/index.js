import express from 'express';
import {
    deleteItem,
    fetchItem,
    fetchItems,
    createItem,
    updateItem
} from '@api/utils';
import { apiFailure, apiSuccess } from '@utils/apiUtils';
import { Stores } from '@models/stores';
export default app => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            const store = await createItem(Stores, req.body);
            return apiSuccess(res, store);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });

    router.get('/', async (req, res, next) =>
        fetchItems(Stores, req.query)
            .then(stores => apiSuccess(res, stores))
            .catch(err => apiFailure(res, err.message))
    );

    router.get('/:_id', async (req, res, next) => {
        const { _id } = req.params;
        return fetchItem(Stores, { _id })
            .then(store => apiSuccess(res, store))
            .catch(err => apiFailure(res, err.err));
    });

    router.put('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return updateItem(Stores, { _id }, req.body)
            .then(stores => apiSuccess(res, stores))
            .catch(err => apiFailure(res, err.message));
    });

    router.delete('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return deleteItem(Stores, { _id })
            .then(stores => apiSuccess(res, stores))
            .catch(err => apiFailure(res, err.err));
    });

    app.use('/stores', router);
};
