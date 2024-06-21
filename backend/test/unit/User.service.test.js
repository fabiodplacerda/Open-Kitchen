import User from '../../src/models/user.model.js';
import UserServices from '../../src/services/User.service.js';
import sinon, { assert } from 'sinon';
import { expect } from 'chai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('UserService', () => {
  let userServices;
  beforeEach(() => {
    userServices = new UserServices();
    sinon.stub(bcrypt, 'compare').resolves(true);
    sinon.stub(jwt, 'sign').returns('testToken');
  });

  afterEach(() => {
    bcrypt.compare.restore();
    jwt.sign.restore();
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
  describe('accountLogin Tests', () => {
    const testUser = {
      _id: '1',
      email: 'test@test.com',
      username: 'testUserName',
      password: 'testPassword',
      savedRecipes: [],
      recipes: [],
    };
    const testToken = 'testToken';

    it('should call findOne', async () => {
      const { password, ...testUserWithoutPassword } = testUser;
      const findOneStub = sinon.stub(User, 'findOne');
      findOneStub.resolves(testUser);

      const result = await userServices.accountLogin(
        testUser.username,
        testUser.password
      );

      expect(result).to.deep.equal({
        user: testUserWithoutPassword,
        token: testToken,
      });
      findOneStub.restore();
    });

    it('should throw an error if a error occurs', async () => {
      const error = new Error('test error');
      const findOneStub = sinon.stub(User, 'findOne');
      findOneStub.throws(error);

      try {
        await userServices.accountLogin(testUser.username, testUser.password);
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(`Login failed: ${error.message}`);
      }
    });
  });
  describe('updateAccount Tests', () => {
    const testUser = {
      _id: '1',
      email: 'test@test.com',
      username: 'testUserName',
      password: 'testPassword',
      savedRecipes: [],
      recipes: [],
    };
    const updateUser = {
      _id: '1',
      email: 'updated@test.com',
      username: 'updatedName',
      savedRecipes: [],
      recipes: [],
    };

    it('should call findOneAndUpdate', async () => {
      const findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate');
      findOneAndUpdateStub.resolves(updateUser);

      const result = await userServices.updateAccount(testUser._id, {
        email: updateUser.email,
        username: updateUser.username,
      });

      expect(result).to.deep.equal(updateUser);
      findOneAndUpdateStub.restore();
    });

    it('should throw an error if a error occurs', async () => {
      const error = new Error('test error');
      const findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate');
      findOneAndUpdateStub.throws(error);

      try {
        await userServices.updateAccount(testUser._id, {
          email: updateUser.email,
          username: updateUser.username,
          password: 'testPassWord',
        });
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(
          `Failed to update the user: ${error.message}`
        );
      }
    });
  });
});
