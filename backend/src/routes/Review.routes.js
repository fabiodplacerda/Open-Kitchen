import { Router } from 'express';
import ReviewController from '../controller/Review.controller.js';
import AuthenticationValidation from '../middleware/Authentication.validation.js';
import ReviewValidator from '../middleware/Review.validation.js';

export default class ReviewRoutes {
  #controller;
  #routeStartingPoint;
  #router;

  constructor(
    controller = new ReviewController(),
    routeStartingPoint = '/recipe'
  ) {
    this.#router = Router();
    this.#controller = controller;
    this.#routeStartingPoint = routeStartingPoint;
    this.#initializedRoutes();
  }

  #initializedRoutes = () => {
    this.#router.post(
      '/:id/createReview',
      AuthenticationValidation.checkToken,
      ReviewValidator.reviewCreation(),
      this.#controller.createReview
    );
    this.#router.get('/:id/reviews', this.#controller.getReviewsByRecipeId);
    this.#router.delete(
      '/:recipeId/reviews/:reviewId',
      AuthenticationValidation.checkToken,
      this.#controller.deleteReview
    );
  };

  getRouter = () => this.#router;

  getRouteStartingPoint = () => this.#routeStartingPoint;
}
