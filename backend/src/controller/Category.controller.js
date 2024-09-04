import CategoryService from '../services/Category.service.js';

export default class CategoryController {
  #service;
  constructor(service = new CategoryService()) {
    this.#service = service;
  }

  getAllCategories = async (_req, res) => {
    try {
      const categories = await this.#service.getAllCategories();

      return res.status(200).json(categories);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
}
