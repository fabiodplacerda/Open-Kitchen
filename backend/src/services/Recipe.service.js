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

  getAllRecipes = async () => {
    try {
      const recipes = await Recipe.find();
      return recipes;
    } catch (e) {
      throw new Error(`Failed to retrieve all recipes: ${e.message}`);
    }
  };

  getSingleRecipe = async recipeId => {
    try {
      const recipe = await Recipe.findOne({ _id: recipeId });

      return recipe;
    } catch (e) {
      throw new Error(`Failed to retrieve the recipe: ${e.message}`);
    }
  };
}
