import { expect } from 'chai';
import sinon from 'sinon';
import Review from '../../../src/models/review.model.js';
import ReviewService from '../../../src/services/Review.service.js';
import reviewsData from '../../data/reviewsData.js';

const { reviews, newReview } = reviewsData;

describe('ReviewService Tests', () => {
  let reviewService;

  beforeEach(() => {
    reviewService = new ReviewService();
  });

  describe('createReview Tests', () => {
    it('should call save and return the result if a new review has been successfully created', async () => {
      // Arrange
      const saveStub = sinon.stub(Review.prototype, 'save');
      saveStub.returns(newReview);
      // Act
      const result = await reviewService.createReview(newReview);
      // Assert
      expect(result).to.equal(newReview);
      expect(saveStub.calledOnce).to.be.true;
      // Restore
      saveStub.restore();
    });
    it('should error when save fails', async () => {
      // Arrange
      const error = new Error('test error');
      const saveStub = sinon.stub(Review.prototype, 'save');
      saveStub.throws(error);
      // Act && Assert

      try {
        await reviewService.createReview(newReview);
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(
          `Failed to create a new review: ${error.message}`
        );
      }
      // Restore
      saveStub.restore();
    });
  });
  describe('getReviewsByRecipeId Tests', () => {
    it('should call find an return all reviews for that recipe', async () => {
      // Arrange
      const recipeId = '667441c68299324f52841990';
      const reviewsByRecipeId = reviews.find(
        review => review.recipeId === recipeId
      );
      const findStub = sinon.stub(Review, 'find');
      findStub.returns(reviewsByRecipeId);
      // Act
      const result = await reviewService.getReviewsByRecipeId(recipeId);
      // Assert
      expect(result).to.equal(reviewsByRecipeId);
      expect(findStub.calledOnce).to.be.true;
      // Restore
      findStub.restore();
    });
    it('should error when find fails', async () => {
      // Arrange
      const recipeId = '667441c68299324f52841990';
      const error = new Error('test error');
      const findStub = sinon.stub(Review, 'find');
      findStub.throws(error);
      // Act && Assert

      try {
        await reviewService.getReviewsByRecipeId(recipeId);
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(
          `Failed to retrieve reviews for recipeId ${recipeId}: ${error.message}`
        );
      }
      // Restore
      findStub.restore();
    });
  });
});
