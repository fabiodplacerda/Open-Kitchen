import Review from '../models/review.model.js';
import Recipe from '../models/recipe.model.js';

export default class ReviewService {
  createReview = async newReview => {
    try {
      const review = new Review(newReview);
      return await review.save();
    } catch (e) {
      throw new Error(`Failed to create a new review: ${e.message}`);
    }
  };

  getReviewsByRecipeId = async recipeId => {
    try {
      const reviews = await Review.find({ recipeId: recipeId }).populate(
        'author',
        'username'
      );

      return reviews;
    } catch (e) {
      throw new Error(
        `Failed to retrieve reviews for recipeId ${recipeId}: ${e.message}`
      );
    }
  };

  deleteReview = async (reviewId, recipeId, userId, role) => {
    try {
      const review = await Review.findById(reviewId);
      if (!review) return null;

      if (review.author.toString() !== userId.toString() && role !== 'admin')
        throw new Error('User has no permissions to delete this review');

      const deletedReview = await Review.findByIdAndDelete(reviewId);

      await Recipe.findByIdAndUpdate(recipeId, {
        $pull: { reviews: reviewId },
      });

      return deletedReview;
    } catch (e) {
      throw new Error(`Failed to delete this review: ${e.message}`);
    }
  };
}
