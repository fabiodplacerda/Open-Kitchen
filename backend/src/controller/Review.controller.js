import ReviewService from '../services/Review.service.js';

export default class ReviewController {
  #service;

  constructor(service = new ReviewService()) {
    this.#service = service;
  }

  createReview = async (req, res) => {
    const { body } = req;

    try {
      const review = await this.#service.createReview(body);

      if (!review) {
        return res
          .status(400)
          .json({ message: 'Failed to create a new review' });
      }
      return res
        .status(201)
        .json({ message: 'review created successfully', newReview: review });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };
  getReviewsByRecipeId = async (req, res) => {
    const { id } = req.params;

    try {
      if (!id) res.status(400).json({ message: 'Invalid id' });

      const reviews = await this.#service.getReviewsByRecipeId(id);

      return res
        .status(200)
        .json({ message: 'reviews retrieved successfully', reviews });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  };

  deleteReview = async (req, res) => {
    const { recipeId, reviewId } = req.params;
    const { body } = req;

    try {
      if (!body)
        return res.status(400).json({ message: 'Body must be provided' });

      const deletedReview = await this.#service.deleteReview(
        reviewId,
        recipeId,
        body.userId,
        body.role
      );

      if (!deletedReview)
        return res.status(404).json({ message: 'review was not found' });

      return res.status(204).send();
    } catch (e) {
      if (e.message.includes('User has no permissions'))
        return res.status(403).json({ message: e.message });

      return res.status(500).json({ message: e.message });
    }
  };
}
