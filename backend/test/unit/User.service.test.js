import User from '../../src/models/user.model.js';
import UserServices from '../../src/services/User.service.js';
import sinon, { assert } from 'sinon';
import { expect } from 'chai';

describe('UserService test', () => {
  let userServices;
  beforeEach(() => {
    userServices = new UserServices();
  });

  describe('createAccount Tests', () => {
    const testNewUser = {
      _id: '1',
      email: 'test@test.com',
      username: 'testUserName',
      password: 'Password123',
      savedRecipes: [],
      recipes: [],
    };
    it('should call save and return the result if newUser has been added successfully', async () => {
      // Arrange
      const saveStub = sinon.stub(User.prototype, 'save');
      saveStub.returns(testNewUser);
      // Act
      const result = await userServices.createAccount(testNewUser);
      // Assert
      expect(result).to.equal(testNewUser);
      // Restore
      saveStub.restore();
    });
    it('should error when save fails', async () => {
      // Arrange
      const error = new Error('test error');
      const saveStub = sinon.stub(User.prototype, 'save');
      saveStub.throws(error);
      // Act && Assert

      try {
        await userServices.createAccount(testNewUser);
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(
          `Failed to create a new user: ${error.message}`
        );
      }
      // Restore
      saveStub.restore();
    });
  });
});
