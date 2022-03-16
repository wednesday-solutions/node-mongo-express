import {
    deleteItem,
    fetchItem,
    fetchItems,
    createItem,
    updateItem
} from '@api/utils';
import { apiFailure, apiSuccess } from '@utils/apiUtils';

export const generatePostRequest = (router, model) => {
    router.post('/', async (req, res) => {
        try {
            const item = await createItem(model, req.body);
            return apiSuccess(res, item);
        } catch (err) {
            return apiFailure(res, err.message);
        }
    });
};
export const generatePatchRequest = (router, model) => {
    router.patch('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return updateItem(model, { _id }, req.body)
            .then(items => apiSuccess(res, items))
            .catch(err => apiFailure(res, err.message));
    });
};

export const generateFetchAllRequest = (router, model) => {
    router.get('/', async (req, res, next) =>
        fetchItems(model, req.query)
            .then(items => apiSuccess(res, items))
            .catch(err => apiFailure(res, err.message))
    );
};
export const generateFetchOneRequest = (router, model) => {
    router.get('/:_id', async (req, res, next) => {
        const { _id } = req.params;
        return fetchItem(model, { _id })
            .then(item => apiSuccess(res, item))
            .catch(err => apiFailure(res, err.err));
    });
};

export const generateDeleteRequest = (router, model) => {
    router.delete('/:_id', (req, res, next) => {
        const { _id } = req.params;
        return deleteItem(model, { _id })
            .then(items => apiSuccess(res, items))
            .catch(err => apiFailure(res, err.err));
    });
};
