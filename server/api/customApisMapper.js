import { fetchAllReferencedOrders } from 'api/referencedOrders';
import { fetchAllUnshardedOrders } from 'api/unshardedOrders';
import { fetchAllUnshardedReferencedOrders } from 'api/unshardedReferencedOrders';
import userValidator from './users/validator';
import { createUser } from 'api/users';
import { createOrder, orderValidator } from './orders';

export const REQUEST_TYPES = {
    create: 'CREATE',
    update: 'UPDATE',
    fetchOne: 'FETCHONE',
    fetchAll: 'FETCHALL',
    remove: 'REMOVE'
};

export const customApisMapper = {
    orders: {
        methods: [
            {
                type: REQUEST_TYPES.create,
                handler: (router, model, validator) => {
                    router.use('/', validator, async (req, res, next) =>
                        createOrder(req, res)
                    );
                },
                validator: orderValidator
            },
            {
                type: REQUEST_TYPES.update
            },
            {
                type: REQUEST_TYPES.remove
            }
        ]
    },
    referencedOrders: {
        methods: [
            {
                type: REQUEST_TYPES.fetchAll,
                handler: fetchAllReferencedOrders
            }
        ]
    },
    unshardedOrders: {
        methods: [
            {
                type: REQUEST_TYPES.fetchAll,
                handler: fetchAllUnshardedOrders
            }
        ]
    },
    unshardedReferencedOrders: {
        methods: [
            {
                type: REQUEST_TYPES.fetchAll,
                handler: fetchAllUnshardedReferencedOrders
            }
        ]
    },
    users: {
        methods: [
            {
                type: REQUEST_TYPES.create,
                handler: createUser,
                validator: userValidator
            }
        ]
    }
};
