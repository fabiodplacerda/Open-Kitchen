import User from '../../src/models/user.model.js';
import UserServices from '../../src/services/User.service.js';
import sinon, { assert } from 'sinon';
import { expect } from 'chai';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usersData from '../data/userData.js';

const { expectedResults, users } = usersData;

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
      expect(saveStub.calledOnce).to.be.true;
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
    it('should call findOne and return a user', async () => {
      const testToken = 'testToken';

      const findOneStub = sinon.stub(User, 'findOne').returns({
        populate: sinon.stub().returns({
          populate: sinon.stub().resolves(expectedResults),
        }),
      });

      const result = await userServices.accountLogin(
        users[0].username,
        users[0].password
      );

      expect(result).to.deep.equal({
        user: expectedResults,
        token: testToken,
      });
      expect(findOneStub.calledOnce).to.be.true;
      findOneStub.restore();
    });

    it('should throw an error if a error occurs', async () => {
      const error = new Error('test error');
      const findOneStub = sinon.stub(User, 'findOne');
      findOneStub.throws(error);

      try {
        await userServices.accountLogin(users[0].username, users[0].password);
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

    it('should call findOneAndUpdate and return the update user', async () => {
      const findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate');
      findOneAndUpdateStub.resolves(updateUser);

      const result = await userServices.updateAccount(testUser._id, {
        email: updateUser.email,
        username: updateUser.username,
      });

      expect(result).to.deep.equal(updateUser);
      expect(findOneAndUpdateStub.calledOnce).to.be.true;
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
  describe('deleteAccount Tests', () => {
    const deletedUser = {
      _id: '667441c68299324f52841987',
      email: 'user3@example.com',
      username: 'user3',
      password: 'Password3',
      role: 'user',
      savedRecipes: [],
      recipes: [],
      __v: 0,
    };
    it('should call findByIdAndDelete and return the deleted user', async () => {
      const findByIdAndDelete = sinon.stub(User, 'findByIdAndDelete');
      findByIdAndDelete.resolves(deletedUser);

      const result = await userServices.deleteAccount(deletedUser._id);

      expect(result).to.deep.equal(deletedUser);
      expect(findByIdAndDelete.calledOnce).to.be.true;

      findByIdAndDelete.restore();
    });
    it('should throw an error if a error occurs', async () => {
      const error = new Error('test error');
      const findByIdAndDelete = sinon.stub(User, 'findByIdAndDelete');
      findByIdAndDelete.throws(error);

      try {
        await userServices.deleteAccount(deletedUser._id);
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(
          `Failed to delete the user: ${error.message}`
        );
      }

      findByIdAndDelete.restore();
    });
  });
  describe('getAllAccounts Tests', () => {
    it('should call find and return all users', async () => {
      const users = [
        {
          _id: '1',
          username: 'user1',
          email: 'user1@gmail.com',
          password: 'password1',
        },
        {
          _id: '2',
          username: 'user2',
          email: 'user2@gmail.com',
          password: 'password2',
        },
      ];

      const usersWithoutPassword = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      const leanStub = sinon.stub().returns(usersWithoutPassword);
      const findStub = sinon.stub(User, 'find').returns({ lean: leanStub });
      findStub.resolves(users);

      const result = await userServices.getAllAccounts();

      expect(findStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(usersWithoutPassword);
      findStub.restore();
    });
    it('should throw an error if a error occurs in the service', async () => {
      const error = new Error('test error');
      const findStub = sinon.stub(User, 'find');
      findStub.throws(error);

      try {
        await userServices.getAllAccounts();
        assert.fail('Expect error was not thrown');
      } catch (e) {
        expect(e.message).to.equal(`Failed to get all users: ${error.message}`);
      }
    });
  });
});
