import { getAllCategories } from 'daos/product';

export const getCategories = async () => {
    try {
        const categories = await getAllCategories();
        return categories;
    } catch (err) {
        throw err;
    }
};
