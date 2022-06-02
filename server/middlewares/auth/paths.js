import { SCOPE_TYPE } from 'utils/constants';
import { Stores } from 'database/models/stores';
import { StoreProducts } from 'database/models/storeProducts';
import { Suppliers } from 'database/models/suppliers';
import { SupplierProducts } from 'database/models/supplierProducts';
import config from 'config';
import { authMiddlewareFunc } from './utils';

export const paths = [
    {
        path: '/assign-roles',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'PUT'
    },
    {
        path: '/roles',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'POST'
    },
    {
        path: '/stores',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'POST'
    },
    {
        path: '/stores',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: {
                    'admin.email': req.user[`${config().apiAudience}/email`]
                },
                ownerKey: 'admin',
                findAll: { key: 'admin.email', value: null }, // value will be added in the middleware
                resourceOwnershipPath: 'admin[0].email' // will be used to get the findAllValue from the resource
            };
            return authMiddlewareFunc(req, Stores, configObj);
        }
    },
    {
        path: '/stores/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return authMiddlewareFunc(req, Stores, configObj);
        }
    },
    {
        path: '/stores/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'PATCH',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return authMiddlewareFunc(req, Stores, configObj);
        }
    },

    {
        path: '/stores/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'DELETE',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return authMiddlewareFunc(req, Stores, configObj);
        }
    },
    {
        path: '/store-products',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'POST',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: { _id: req.body.storeId },
                ownerKey: 'admin'
            };
            return authMiddlewareFunc(req, Stores, configObj);
        }
    },
    {
        path: '/store-products',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: {
                    'store.admin.email':
                        req.user[`${config().apiAudience}/email`]
                },
                ownerKey: 'store.admin',
                findAll: { key: 'storeId', value: null }, // value will be added in the middleware
                resourceOwnershipPath: 'storeId' // will be used to get the findAllValue from the resource
            };
            return authMiddlewareFunc(req, StoreProducts, configObj);
        }
    },
    {
        path: '/store-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: {
                    _id: req.params._id
                },
                ownerKey: 'store.admin'
            };
            return authMiddlewareFunc(req, StoreProducts, configObj);
        }
    },
    {
        path: '/store-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'DELETE',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: {
                    _id: req.params._id
                },
                ownerKey: 'store.admin'
            };
            return authMiddlewareFunc(req, StoreProducts, configObj);
        }
    },
    {
        path: '/suppliers',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'POST'
    },
    {
        path: '/suppliers/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return authMiddlewareFunc(req, Suppliers, configObj);
        }
    },
    {
        path: '/suppliers',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { 'admin.email': requesterEmail },
                ownerKey: 'admin',
                findAll: { key: '_id', value: null }, // value will be added in the middleware
                resourceOwnershipPath: '_id' // will be used to get the findAllValue from the resource
            };
            return authMiddlewareFunc(req, Suppliers, configObj);
        }
    },
    {
        path: '/suppliers/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'PATCH',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return authMiddlewareFunc(req, Suppliers, configObj);
        }
    },
    {
        path: '/suppliers/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'DELETE',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return authMiddlewareFunc(req, Suppliers, configObj);
        }
    },
    {
        path: '/supplier-products',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'POST',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: { _id: req.body.supplierId },
                ownerKey: 'admin'
            };
            return authMiddlewareFunc(req, Suppliers, configObj);
        }
    },
    {
        path: '/supplier-products',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: {
                    'supplier.admin.email':
                        req.user[`${config().apiAudience}/email`]
                },
                ownerKey: 'supplier.admin',
                findAll: { key: 'supplierId', value: null }, // value will be added in the middleware
                resourceOwnershipPath: 'supplierId' // will be used to get the findAll value from the resource
            };
            return authMiddlewareFunc(req, SupplierProducts, configObj);
        }
    },
    {
        path: '/supplier-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'supplier.admin'
            };
            return authMiddlewareFunc(req, SupplierProducts, configObj);
        }
    },
    {
        path: '/supplier-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'PATCH',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'supplier.admin'
            };
            return authMiddlewareFunc(req, SupplierProducts, configObj);
        }
    },
    {
        path: '/supplier-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'DELETE',
        authMiddleware: async (req, res, next) => {
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'supplier.admin'
            };
            return authMiddlewareFunc(req, SupplierProducts, configObj);
        }
    }
];
