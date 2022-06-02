import moment from 'moment';
import { Orders } from 'models/orders';

export const createNewOrder = async orderData => {
    try {
        return Orders.create(orderData);
    } catch (error) {
        throw error;
    }
};

export const totalAmtForDate = async date => {
    try {
        let startDate = moment(date).startOf('day');
        let endDate = moment(date).endOf('day');
        let aggregateQuery = [];

        aggregateQuery.push({
            $project: {
                _id: 1,
                totalPrice: 1,
                purchasedProducts: 1,
                createdAt: 1
            }
        });

        aggregateQuery.push({
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        });
        aggregateQuery.push({
            $group: {
                _id: null,
                totalPrice: { $sum: '$totalPrice' }
            }
        });
        const data = await Orders.aggregate(aggregateQuery).exec();
        return data[0]?.totalPrice || 0;
    } catch (error) {
        throw error;
    }
};

export const earliestCreatedDate = async () => {
    try {
        const order = await Orders.findOne().sort({ createdAt: 1 }).limit(1);

        return order.createdAt.toISOString().split('T')[0];
    } catch (error) {
        throw error;
    }
};

export const totalByDateForCategory = async (date, category) => {
    try {
        let startDate = moment(date).startOf('day').toISOString();
        let endDate = moment(date).endOf('day').toISOString();
        let aggregateQuery = [];

        aggregateQuery.push({
            $project: {
                _id: 1,
                totalPrice: 1,
                purchasedProducts: 1,
                createdAt: 1
            }
        });
        aggregateQuery.push({
            $unwind: {
                path: '$purchasedProducts',
                preserveNullAndEmptyArrays: true
            }
        });
        aggregateQuery.push({
            $match: {
                'purchasedProducts.category': category,
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        });
        aggregateQuery.push({
            $group: {
                _id: '$_id',
                totalPrice: { $first: '$totalPrice' }
            }
        });
        aggregateQuery.push({
            $group: {
                _id: null,
                totalPrice: { $sum: '$totalPrice' }
            }
        });

        const data = await Orders.aggregate(aggregateQuery).exec();
        return data[0]?.totalPrice || 0;
    } catch (error) {
        throw error;
    }
};

export const countByDate = async date => {
    try {
        let startDate = moment(date).startOf('day');
        let endDate = moment(date).endOf('day');
        let aggregateQuery = [];

        aggregateQuery.push({
            $project: {
                _id: 1,
                totalPrice: 1,
                purchasedProducts: 1,
                createdAt: 1
            }
        });

        aggregateQuery.push({
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        });
        aggregateQuery.push({
            $count: 'totalOrder'
        });

        const totalOrder = await Orders.aggregate(aggregateQuery).exec();
        return totalOrder[0]?.totalOrder || 0;
    } catch (error) {
        throw error;
    }
};

export const countByDateForCategory = async (date, category) => {
    try {
        let startDate = moment(date).startOf('day').toISOString();
        let endDate = moment(date).endOf('day').toISOString();
        let aggregateQuery = [];

        aggregateQuery.push({
            $project: {
                _id: 1,
                totalPrice: 1,
                purchasedProducts: 1,
                createdAt: 1
            }
        });
        aggregateQuery.push({
            $unwind: {
                path: '$purchasedProducts',
                preserveNullAndEmptyArrays: true
            }
        });
        aggregateQuery.push({
            $match: {
                'purchasedProducts.category': category,
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        });
        aggregateQuery.push({
            $group: {
                _id: '$_id'
            }
        });
        aggregateQuery.push({
            $count: 'totalOrder'
        });
        const totalCount = await Orders.aggregate(aggregateQuery).exec();
        return totalCount[0]?.totalOrder || 0;
    } catch (error) {
        throw error;
    }
};
