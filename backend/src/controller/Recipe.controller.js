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

  getAllRecipes = async (req, res) => {
    try {
      const recipes = await this.#service.getAllRecipes();

      return res
        .status(200)
        .json({ message: 'Request was successful', recipes });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
  getSingleRecipe = async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) res.status(400).json({ message: 'A valid Id must be provided' });

      const recipe = await this.#service.getSingleRecipe(id);

      if (!recipe) res.status(404).json({ message: 'Recipe was not found' });

      return res
        .status(200)
        .json({ message: 'Request was successful', recipe });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };

  updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
      const updatedRecipe = await this.#service.updateRecipe(
        id,
        body.userId,
        body.updates
      );

      if (!updatedRecipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      return res
        .status(200)
        .json({ message: 'Recipe updated successfully', updatedRecipe });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
}
