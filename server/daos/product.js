import { Products } from 'models/products';
import { redis } from 'services/redis';

export const getAllCategories = async () => {
    try {
        const categoriesFromRedis = await redis.get('categories');
        let categories;
        if (!categoriesFromRedis) {
            const allCategories = await Products.distinct('category');
            redis.set('categories', JSON.stringify(allCategories));
            categories = allCategories;
        } else {
            categories = JSON.parse(categoriesFromRedis);
        }
        return categories;
    } catch (error) {
        throw error;
    }
};
