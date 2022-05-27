import { SCOPE_TYPE } from 'utils/constants';
import { checkOwnership } from 'middlewares/custom';
import { Stores } from 'models/stores';
import { StoreProducts } from 'models/storeProducts';
import { Suppliers } from 'models/suppliers';
import { SupplierProducts } from 'models/supplierProducts';
import config from 'config';
export const paths = [
    {
        path: '/assign-roles/',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'PUT'
    },
    {
        path: '/roles/',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'POST'
    },
    {
        //Ask if scope is correct or not
        path: '/stores/',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'POST'
    },
    {
        path: '/stores/',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];

            const configObj = {
                condition: { 'admin.email': requesterEmail },
                ownerKey: 'admin',
                findAllKey: 'admin.email',
                findAllValue: null, // will be added in the middleware
                resourceOwnershipPath: 'admin[0].email' // will be used to get the findAllValue from the resource
            };
            return await checkOwnership(requesterEmail, Stores, configObj);
        }
    },
    {
        path: '/stores/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return await checkOwnership(requesterEmail, Stores, configObj);
        }
    },
    {
        path: '/stores/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'PATCH',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return await checkOwnership(requesterEmail, Stores, configObj);
        }
    },

    {
        path: '/stores/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'DELETE',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return await checkOwnership(requesterEmail, Stores, configObj);
        }
    },
    {
        // Assumption we get the storeId inside req.body
        path: '/store-products/',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'POST',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { _id: req.body.storeId },
                ownerKey: 'admin'
            };
            return await checkOwnership(requesterEmail, Stores, configObj);
        }
    },
    {
        // Ask if the findAll condition is right or not ?
        path: '/store-products/',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { 'store.admin.email': requesterEmail },
                ownerKey: 'store.admin',
                findAllKey: 'storeId',
                findAllValue: null, // will be added in the middleware
                resourceOwnershipPath: 'storeId' // will be used to get the findAllValue from the resource
            };
            return await checkOwnership(
                requesterEmail,
                StoreProducts,
                configObj
            );
        }
    },
    {
        //  Ask findOne condition is right or wrong ?
        path: '/store-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: {
                    _id: req.params._id
                },
                ownerKey: 'store.admin'
            };
            return await checkOwnership(
                requesterEmail,
                StoreProducts,
                configObj
            );
        }
    },
    {
        path: '/store-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.STORE_ADMIN],
        method: 'DELETE',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: {
                    _id: req.params._id
                },
                ownerKey: 'store.admin'
            };
            return await checkOwnership(
                requesterEmail,
                StoreProducts,
                configObj
            );
        }
    },
    {
        // Ask if the scope is right for these api ?
        path: '/suppliers/',
        scopes: [SCOPE_TYPE.SUPER_ADMIN],
        method: 'POST'
    },
    {
        path: '/suppliers/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return await checkOwnership(requesterEmail, Suppliers, configObj);
        }
    },
    {
        path: '/suppliers/',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { 'admin.email': requesterEmail },
                ownerKey: 'admin',
                findAllKey: '_id',
                findAllValue: null, // will be added in the middleware
                resourceOwnershipPath: '_id' // will be used to get the findAllValue from the resource
            };
            return await checkOwnership(requesterEmail, Suppliers, configObj);
        }
    },
    {
        path: '/suppliers/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'PATCH',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return await checkOwnership(requesterEmail, Suppliers, configObj);
        }
    },
    {
        path: '/suppliers/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'DELETE',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'admin'
            };
            return await checkOwnership(requesterEmail, Suppliers, configObj);
        }
    },
    {
        // Assumption we get the supplierId inside req.body
        path: '/supplier-products/',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'POST',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { _id: req.body.supplierId },
                ownerKey: 'admin'
            };
            return await checkOwnership(requesterEmail, Suppliers, configObj);
        }
    },
    {
        // is findAll condition is wrong ?
        path: '/supplier-products/',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { 'supplier.admin.email': requesterEmail },
                ownerKey: 'supplier.admin',
                findAllKey: 'supplierId',
                findAllValue: null, // will be added in the middleware
                resourceOwnershipPath: 'supplierId' // will be used to get the findAllValue from the resource
            };
            return await checkOwnership(
                requesterEmail,
                SupplierProducts,
                configObj
            );
        }
    },
    {
        path: '/supplier-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'GET',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'supplier.admin'
            };
            return await checkOwnership(
                requesterEmail,
                SupplierProducts,
                configObj
            );
        }
    },
    {
        path: '/supplier-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'PATCH',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'supplier.admin'
            };
            return await checkOwnership(
                requesterEmail,
                SupplierProducts,
                configObj
            );
        }
    },
    {
        path: '/supplier-products/:_id',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.SUPPLIER_ADMIN],
        method: 'DELETE',
        authMiddleware: async (req, res, next) => {
            const requesterEmail = req.user[`${config().apiAudience}/email`];
            const configObj = {
                condition: { _id: req.params._id },
                ownerKey: 'supplier.admin'
            };
            return await checkOwnership(
                requesterEmail,
                SupplierProducts,
                configObj
            );
        }
    }
];
