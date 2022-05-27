module.exports = {
    // This date indicates when the mutations on createPurchasedProduct went live. We will not have to recalculate aggregate from database after this date.
    REDIS_IMPLEMENTATION_DATE: '2022-04-05T00:00:00.000Z',
    SCOPE_TYPE: {
        ADMIN: 'ADMIN',
        SUPER_ADMIN: 'SUPER_ADMIN',
        STORE_ADMIN: 'STORE_ADMIN',
        SUPPLIER_ADMIN: 'SUPPLIER_ADMIN'
    }
};
