import { redis } from 'services/redis';
const moment = require('moment');

export const updateOrderDetailInRedis = async orderDetail => {
    const currentDate = moment().format('YYYY-MM-DD');
    for (const product of orderDetail.purchasedProducts) {
        const redisAggregateCategory = JSON.parse(
            await redis.get(`${currentDate}_${product.category}`)
        );
        await redis.set(
            `${currentDate}_${product.category}`,
            JSON.stringify({
                total:
                    redisAggregateCategory?.total +
                        product.price * product.quantity ||
                    product.price * product.quantity,
                count:
                    redisAggregateCategory?.count + product.quantity ||
                    product.quantity
            })
        );
    }

    const redisAggregate = JSON.parse(await redis.get(`${currentDate}_total`));
    redis.set(
        `${currentDate}_total`,
        JSON.stringify({
            total:
                redisAggregate?.total + orderDetail.totalPrice ||
                orderDetail.totalPrice,
            count: redisAggregate?.count + 1 || 1
        })
    );
};
