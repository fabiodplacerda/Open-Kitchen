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
}
