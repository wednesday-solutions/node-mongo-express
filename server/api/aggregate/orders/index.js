import { totalAmtForDate, totalByDateForCategory } from 'daos/order';
import { validationResult } from 'express-validator';
import { apiFailure, apiSuccess } from 'utils/apiUtils';
import aggregatedOrderAmountValidator from './validator';

const fetchAggregatedOrderAmount = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { message: errors.errors[0].msg };
        }
        const { date, category } = req.query;
        let totalOrderAmount;
        if (date && category) {
            totalOrderAmount = await totalByDateForCategory(date, category);
        } else {
            totalOrderAmount = await totalAmtForDate(date);
        }
        return apiSuccess(res, { totalOrderAmount });
    } catch (err) {
        return apiFailure(res, err.message);
    }
};

export { fetchAggregatedOrderAmount, aggregatedOrderAmountValidator };
