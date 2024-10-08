import Recipe from '../models/recipe.model.js';
import Review from '../models/review.model.js';
import User from '../models/user.model.js';

export default class RecipeService {
  createRecipe = async newRecipe => {
    try {
      const recipe = new Recipe(newRecipe);
      const savedRecipe = await recipe.save();

      await User.findByIdAndUpdate(savedRecipe.author, {
        $push: { recipes: savedRecipe._id },
      });

      return savedRecipe;
    } catch (e) {
      throw new Error(`Failed to create a new recipe: ${e.message}`);
    }
  };

  getAllRecipes = async () => {
    try {
      const recipes = await Recipe.find()
        .populate('reviews', 'rating')
        .populate('category');

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

  deleteRecipe = async (recipeId, userId) => {
    try {
      const recipe = await Recipe.findById(recipeId);

      const user = await User.findById(userId);

      if (!recipe) return null;

      if (recipe.author.toString() !== userId && user.role !== 'admin')
        throw new Error('User has no permission to delete this recipe');

      const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

      await User.findByIdAndUpdate(recipe.author, {
        $pull: { recipes: recipeId },
      });

      await Review.deleteMany({ recipeId: recipeId });

      return deletedRecipe;
    } catch (e) {
      throw new Error(`Failed to delete the recipe: ${e.message}`);
    }
  };

  getRecipesByAuthorId = async authorId => {
    try {
      const recipes = await Recipe.find({ author: authorId })
        .populate('reviews', 'rating')
        .populate('category');

      return recipes;
    } catch (e) {
      throw new Error(`Failed to retrieve recipes by userId: ${e.message}`);
    }
  };

  getRecipesByName = async searchTerm => {
    try {
      const recipes = await Recipe.find({
        name: { $regex: searchTerm, $options: 'i' },
      })
        .populate('reviews', 'rating')
        .populate('category');

      return recipes;
    } catch (e) {
      throw new Error(`Failed to retrieve recipes by name: ${e.message}`);
    }
  };
}
