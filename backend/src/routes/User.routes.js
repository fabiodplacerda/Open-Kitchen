import { Router } from 'express';
import UserController from '../controller/User.controller.js';
import UserValidator from '../middleware/User.validation.js';

export default class UserRoutes {
  #controller;
  #routeStartingPoint;
  #router;

  constructor(controller = new UserController(), routeStartingPoint = '/user') {
    this.#router = Router();
    this.#controller = controller;
    this.#routeStartingPoint = routeStartingPoint;
    this.#initializedRoutes();
  }

  #initializedRoutes = () => {
    this.#router.post(
      '/createAccount',
      UserValidator.accountCreationValidate(),
      this.#controller.createAccount
    );
  };

  getRouter = () => this.#router;

  getRouteStartingPoint = () => this.#routeStartingPoint;
}
