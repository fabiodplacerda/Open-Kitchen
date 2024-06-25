import Review from '../models/review.model.js';

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
      const reviews = await Review.find({ recipeId: recipeId });

      return reviews;
    } catch (e) {
      throw new Error(
        `Failed to retrieve reviews for recipeId ${recipeId}: ${e.message}`
      );
    }
  };
}
