import Recipe from '../models/recipe.model.js';

export default class RecipeService {
  createRecipe = async newRecipe => {
    try {
      const recipe = new Recipe(newRecipe);
      return await recipe.save();
    } catch (e) {
      throw new Error(`Failed to create a new recipe: ${e.message}`);
    }
  };
}
