import { expect } from 'chai';
import UserController from '../../../src/controller/User.controller.js';
import sinon from 'sinon';
import usersData from '../../data/userData.js';

const { users } = usersData;

describe('UserController', () => {
  let userController, userService, req, res, testError;

  beforeEach(() => {
    userService = {
      createAccount: sinon.stub(),
      accountLogin: sinon.stub(),
      updateAccount: sinon.stub(),
      deleteAccount: sinon.stub(),
      getAllAccounts: sinon.stub(),
    };
    userController = new UserController(userService);
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

  describe('createAccount Tests', () => {
    const testNewUser = {
      _id: '1',
      email: 'test@test.com',
      username: 'testUserName',
      password: 'Password123',
    };
    it('should add a new user ', async () => {
      userService.createAccount.resolves(testNewUser);
      const userData = {
        id: testNewUser._id,
        username: testNewUser.username,
        email: testNewUser.email,
        role: testNewUser.role,
      };
      await userController.createAccount(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(
        res.json.calledWith({
          message: 'User created successfully',
          newUser: userData,
        })
      ).to.be.true;
    });
    it('should send a 400 if body is null', async () => {
      req.body = null;

      await userController.createAccount(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });
    it('should send a 400 if fails to create a user', async () => {
      userService.createAccount.resolves(null);
      await userController.createAccount(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Failed to create a new user' })).to
        .be.true;
    });
    it('should send a 500 a error occurs', async () => {
      const testError = new Error('test error');
      userService.createAccount.throws(testError);
      await userController.createAccount(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
  describe('accountLogin Tests', () => {
    const testUser = {
      _id: '1',
      email: 'test@test.com',
      username: 'testUserName',
      password: 'testPassword',
    };

    const testToken = 'testToken';
    it('should return a user and a token back if successful', async () => {
      req.body = testUser;
      const { password, ...testUserWithoutPassword } = testUser;

      userService.accountLogin.resolves({
        user: testUserWithoutPassword,
        token: testToken,
      });

      const expectedResponse = {
        message: 'Authentication successful',
        user: testUserWithoutPassword,
        token: testToken,
      };

      await userController.accountLogin(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(expectedResponse)).to.be.true;
    });
    it('should respond with a 400 if no body is empty', async () => {
      req.body = null;

      await userController.accountLogin(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Invalid req.body' }));
    });
    it('should respond with a 401 if authentication fails', async () => {
      req.body = testUser;
      userService.accountLogin.resolves(null);

      await userController.accountLogin(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: 'Authentication failed' })).to.be
        .true;
    });
    it('should respond with a 500 a error was thrown', async () => {
      req.body = testUser;
      userService.accountLogin.throws(testError);

      await userController.accountLogin(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
  describe('updateAccount Tests', () => {
    const updatedUser = {
      _id: '1',
      email: 'test@test.com',
      username: 'testUserName',
      password: 'testPassword',
    };
    const updates = {
      email: 'test@test.com',
      username: 'testUserName',
      password: 'testPassword',
    };

    it('should return an updated user back if update was successful', async () => {
      req.params.id = '1';
      req.body = updates;
      userService.updateAccount.resolves(updatedUser);

      const expectedResponse = {
        message: 'User updated successfully',
        user: updatedUser,
      };

      await userController.updateAccount(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(expectedResponse)).to.be.true;
    });
    it('should respond with a 404 if user id was not found', async () => {
      req.params.id = '1';
      req.body = updates;
      userService.updateAccount.resolves(null);

      await userController.updateAccount(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'User not found' })).to.be.true;
    });
    it('should respond with a 500 a error was thrown', async () => {
      req.params.id = '1';
      req.body = updates;
      userService.updateAccount.throws(testError);

      await userController.updateAccount(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
  describe('deleteAccount Tests', () => {
    const accountToDelete = {
      _id: '1',
      email: 'test@test.com',
      username: 'testUserName',
      password: 'testPassword',
    };
    it('should delete a account', async () => {
      userService.deleteAccount.resolves(accountToDelete);

      await userController.deleteAccount(req, res);

      expect(res.status.calledWith(204)).to.be.true;
    });
    it('should respond with a 404 if no id was provided', async () => {
      req.params.id = '1';

      userService.deleteAccount.resolves(null);
      await userController.deleteAccount(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'User not found' })).to.be.true;
    });
    it('should respond with a 500 a error was thrown by the service', async () => {
      req.params.id = '1';

      userService.deleteAccount.throws(testError);
      await userController.deleteAccount(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
  describe('getAllAccounts Tests', () => {
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    it('should get all the users and return them', async () => {
      userService.getAllAccounts.resolves(usersWithoutPassword);
      await userController.getAllAccounts(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(usersWithoutPassword)).to.be.true;
    });
    it('should get all the users and return them if there are no users', async () => {
      userService.getAllAccounts.resolves([]);
      await userController.getAllAccounts(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith([])).to.be.true;
    });
    it('should respond with a 500 if a error was thrown in the service', async () => {
      userService.getAllAccounts.throws(testError);
      await userController.getAllAccounts(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: 'test error' })).to.be.true;
    });
  });
});
