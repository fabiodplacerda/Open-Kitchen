import RecipeService from '../services/Recipe.service.js';

export default class RecipeController {
  #service;

  constructor(service = new RecipeService()) {
    this.#service = service;
  }

  createRecipe = async (req, res) => {
    const { body } = req;

    try {
      const recipe = await this.#service.createRecipe(body);

      if (!recipe) {
        return res
          .status(400)
          .json({ message: 'Failed to create a new recipe' });
      }
      return res
        .status(201)
        .json({ message: 'Recipe created successfully', newRecipe: recipe });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
}
