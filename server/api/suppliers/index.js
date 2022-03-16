import express from 'express';
import {
    deleteItem,
    fetchItem,
    fetchItems,
    createItem,
    updateItem
} from '@api/utils';
import { apiFailure, apiSuccess } from '@utils/apiUtils';
import { Suppliers } from '@models/suppliers';
export default app => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            const supplier = await createItem(Suppliers, req.body);
            return apiSuccess(res, supplier);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });

    router.get('/', async (req, res, next) =>
        fetchItems(Suppliers, req.query)
            .then(suppliers => apiSuccess(res, suppliers))
            .catch(err => apiFailure(res, err.message))
    );

    router.get('/:_id', async (req, res, next) => {
        const { _id } = req.params;
        return fetchItem(Suppliers, { _id })
            .then(supplier => apiSuccess(res, supplier))
            .catch(err => apiFailure(res, err.err));
    });

    router.put('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return updateItem(Suppliers, { _id }, req.body)
            .then(suppliers => apiSuccess(res, suppliers))
            .catch(err => apiFailure(res, err.message));
    });

    router.delete('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return deleteItem(Suppliers, { _id })
            .then(suppliers => apiSuccess(res, suppliers))
            .catch(err => apiFailure(res, err.err));
    });

    app.use('/suppliers', router);
};
