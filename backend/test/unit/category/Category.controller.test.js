import { expect } from 'chai';
import sinon from 'sinon';
import CategoryController from '../../../src/controller/Category.controller.js';
import categoriesData from '../../data/categoriesData.js';

describe('CategoryController', () => {
  let categoryController, categoryService, req, res, testError;

  beforeEach(() => {
    categoryService = {
      getAllCategories: sinon.stub(),
    };
    categoryController = new CategoryController(categoryService);
    res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };
  });

  describe('getAllCategories Tests', () => {
    it('should get all the recipes', async () => {
      categoryService.getAllCategories.resolves(categoriesData);

      await categoryController.getAllCategories(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(categoriesData)).to.be.true;
    });

    it('should send a 500 if a error occurs', async () => {
      testError = new Error('test error');

      categoryService.getAllCategories.throws(testError);

      await categoryController.getAllCategories(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
});
