var httpContext = require('express-http-context');
export const createItem = async (model, args) => {
    try {
        return model.create(args);
    } catch (err) {
        log.info({ err });
        throw err;
    }
};

// no page & no limit
// have page & have limit
// have limit > 100

export const fetchItems = async (model, query) => {
    try {
        if (!query.limit || query.limit > 100) {
            query.limit = 100;
        }
        query.page = query.page || 0;
        const condition = httpContext.get('condition') || {};
        return model
            .find(condition)
            .skip(query.page * query.limit)
            .limit(query.limit);
    } catch (err) {
        log.info({ err });
        throw err;
    }
};

export const fetchItem = async (model, args) => {
    try {
        console.log({ args });
        return model.findOne(args);
    } catch (err) {
        log.info({ err });
        throw err;
    }
};
export const updateItem = async (model, where, args) => {
    try {
        await model.updateOne(where, args);
        return fetchItem(model, where);
    } catch (err) {
        log.info({ err });
        throw err;
    }
};
export const deleteItem = async (model, where) => {
    try {
        return model.deleteOne(where);
    } catch (err) {
        log.info({ err });
        throw err;
    }
};

export const createUser = async (model, args) => {
    try {
        return model.create(args);
    } catch (err) {
        log.info({ err });
        throw err;
    }
};

export const fetchAllPurchasedProducts = async (model, query) =>
    model
        .find()
        .select('purchasedProducts')
        .populate('purchasedProducts')
        .skip(query.page * query.limit)
        .limit(query.limit);
