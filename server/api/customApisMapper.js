import orderValidator from './orders/validator';
import { createOrder } from '@api/orders';
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
                handler: createOrder,
                validator: orderValidator
            }
        ]
    }
};
