import moment from 'moment';
import { redis } from 'services/redis';
import { REDIS_IMPLEMENTATION_DATE } from 'utils/constants';
import { getCategories } from '../products';
import {
    getTotalOrderCountByDate,
    getTotalOrderCountByDateForCategory,
    getEarliestOrderCreatedDate,
    getTotalOrderAmtForDate,
    getTotalOrderAmtByDateForCategory
} from '../orders';

export const aggregateCheck = async () => {
    try {
        let startDate, lastSyncFor;
        const endDate = moment(REDIS_IMPLEMENTATION_DATE);
        const redisValueForLastSync = await redis.get('lastSyncFor');
        if (redisValueForLastSync) {
            lastSyncFor = moment(redisValueForLastSync);
        }
        if (!lastSyncFor) {
            startDate = moment(await getEarliestOrderCreatedDate());
        } else if (moment(lastSyncFor).isSameOrAfter(endDate)) {
            log.info(`Redis is updated with aggregate values until ${endDate}`);
            return;
        } else {
            startDate = lastSyncFor;
        }
        const categories = await getCategories();
        while (moment(startDate).isBefore(endDate)) {
            const formattedDate = startDate.format('YYYY-MM-DD');
            const totalAmtForDate = await getTotalOrderAmtForDate(
                formattedDate
            );
            const countForDate = await getTotalOrderCountByDate(formattedDate);

            redis.set(
                `${formattedDate}_total`,
                JSON.stringify({
                    total: totalAmtForDate,
                    count: countForDate
                })
            );
            for (const category of categories) {
                const categoryTotal = await getTotalOrderAmtByDateForCategory(
                    formattedDate,
                    category
                );
                const categoryCount = await getTotalOrderCountByDateForCategory(
                    formattedDate,
                    category
                );

                redis.set(
                    `${formattedDate}_${category}`,
                    JSON.stringify({
                        total: categoryTotal,
                        count: categoryCount
                    })
                );

                await redis.set('lastSyncFor', formattedDate);
            }
            startDate = startDate.add(1, 'day');
        }
    } catch (error) {
        log.info('Error while running aggregate check :', error.message);
    }
};
