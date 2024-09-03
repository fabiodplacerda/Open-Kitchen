import { assert, expect } from 'chai';
import sinon from 'sinon';
import CategoryService from '../../../src/services/Category.service.js';
import Category from '../../../src/models/category.model.js';
import categoriesData from '../../data/categoriesData.js';

describe('CategoryService Tests', () => {
  let categoryService;

  beforeEach(() => {
    categoryService = new CategoryService();
  });
  describe('getAllCategories Tests', () => {
    it('should call find a returns all categories', async () => {
      const findStub = sinon.stub(Category, 'find').resolves(categoriesData);

      const result = await categoryService.getAllCategories();
      expect(result).to.equal(categoriesData);
      expect(findStub.calledOnce).to.be.true;

      findStub.restore();
    });
    it('should throw an error if an error occurs', async () => {
      const testError = new Error('test error');
      const findStub = sinon.stub(Category, 'find').throws(testError);

      try {
        await categoryService.getAllCategories();
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(
          'Failed to retrieve all categories: test error'
        );
      }
    });
  });
});
