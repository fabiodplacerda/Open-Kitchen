import Category from '../models/category.model.js';

export default class CategoryService {
  getAllCategories = async () => {
    try {
      const categories = await Category.find();
      return categories;
    } catch (e) {
      throw new Error(`Failed to retrieve all categories: ${e.message}`);
    }
  };
}
