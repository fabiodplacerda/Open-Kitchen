import { expect } from 'chai';
import ReviewController from '../../../src/controller/Review.controller.js';
import reviewsData from '../../data/reviewsData.js';
import sinon from 'sinon';

const { reviews, newReview } = reviewsData;

describe('ReviewController', () => {
  let reviewController, reviewService, req, res, testError;

  beforeEach(() => {
    reviewService = {
      createReview: sinon.stub(),
    };
    reviewController = new ReviewController(reviewService);
    req = {
      body: {},
      params: {},
    };
    res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    testError = new Error('test error');
  });

  describe('createRecipe Tests', () => {
    it('should create a new review ', async () => {
      reviewService.createReview.resolves(newReview);
      await reviewController.createReview(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(
        res.json.calledWith({
          message: 'review created successfully',
          newReview,
        })
      ).to.be.true;
    });
    it('should send a 400 if body is null', async () => {
      req.body = null;

      await reviewController.createReview(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });
    it('should send a 400 if fails to create a recipe', async () => {
      reviewService.createReview.resolves(null);
      await reviewController.createReview(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Failed to create a new review' }))
        .to.be.true;
    });
    it('should send a 500 a error occurs', async () => {
      const testError = new Error('test error');
      reviewService.createReview.throws(testError);
      await reviewController.createReview(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
});
