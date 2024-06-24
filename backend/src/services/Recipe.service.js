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

  updateRecipe = async (recipeId, userId, updates) => {
    try {
      const recipe = await Recipe.findById(recipeId);

      if (!recipe) return null;

      if (recipe.author.toString() !== userId)
        throw new Error('User has no permission to edit this recipe');

      const updatedRecipe = await Recipe.findOneAndUpdate(
        { _id: recipeId },
        { $set: updates },
        {
          new: true,
          runValidators: true,
        }
      );

      return updatedRecipe;
    } catch (e) {
      throw new Error(`Failed to update the recipe: ${e.message}`);
    }
  };
}
