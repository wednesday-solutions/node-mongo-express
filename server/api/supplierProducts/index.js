import express from 'express';
import {
    deleteItem,
    fetchItem,
    fetchItems,
    createItem,
    updateItem
} from '@api/utils';
import { apiFailure, apiSuccess } from '@utils/apiUtils';
import { SupplierProducts } from '@models/supplierProducts';
export default app => {
    const router = express.Router();

    router.post('/', async (req, res) => {
        try {
            const order = await createItem(SupplierProducts, req.body);
            return apiSuccess(res, order);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });

    router.get('/', async (req, res, next) =>
        fetchItems(SupplierProducts, req.query)
            .then(supplierProducts => apiSuccess(res, supplierProducts))
            .catch(err => apiFailure(res, err.message))
    );

    router.get('/:_id', async (req, res, next) => {
        const { _id } = req.params;
        return fetchItem(SupplierProducts, { _id })
            .then(order => apiSuccess(res, order))
            .catch(err => apiFailure(res, err.err));
    });

    router.put('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return updateItem(SupplierProducts, { _id }, req.body)
            .then(supplierProducts => apiSuccess(res, supplierProducts))
            .catch(err => apiFailure(res, err.message));
    });

    router.delete('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return deleteItem(SupplierProducts, { _id })
            .then(supplierProducts => apiSuccess(res, supplierProducts))
            .catch(err => apiFailure(res, err.err));
    });

    app.use('/supplierProducts', router);
};
