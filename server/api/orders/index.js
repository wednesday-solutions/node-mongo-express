import { validationResult } from 'express-validator';
import {
    createNewOrder,
    totalAmtForDate,
    earliestCreatedDate,
    totalByDateForCategory,
    countByDate,
    countByDateForCategory
} from 'daos/order';
import orderValidator from './validator';
import { updateOrderDetailInRedis } from './updateRedis';
import { apiFailure, apiSuccess } from 'utils/apiUtils';

export const createOrder = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { message: errors.errors[0].msg };
        }
        const order = await createNewOrder(req.body);
        updateOrderDetailInRedis(order);
        return apiSuccess(res, order);
    } catch (err) {
        return apiFailure(res, err.message, 400);
    }
};

export const getTotalOrderAmtForDate = async date => {
    try {
        const totalAmt = await totalAmtForDate(date);
        return totalAmt;
    } catch (error) {
        throw error;
    }
};

export const getEarliestOrderCreatedDate = async () => {
    try {
        const earliestDate = await earliestCreatedDate();
        return earliestDate;
    } catch (error) {
        throw error;
    }
};

export const getTotalOrderAmtByDateForCategory = async (date, category) => {
    try {
        const totalAmt = await totalByDateForCategory(date, category);
        return totalAmt;
    } catch (error) {
        throw error;
    }
};

export const getTotalOrderCountByDate = async date => {
    try {
        const totalOrderCount = await countByDate(date);
        return totalOrderCount;
    } catch (error) {
        throw error;
    }
};

export const getTotalOrderCountByDateForCategory = async (date, category) => {
    try {
        const totalOrderCount = await countByDateForCategory(date, category);
        return totalOrderCount;
    } catch (error) {
        throw error;
    }
};

export { orderValidator };
