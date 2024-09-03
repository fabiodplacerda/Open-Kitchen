import { Router } from 'express';
import CategoryController from '../controller/Category.controller.js';

export default class CategoryRoutes {
  #controller;
  #routeStartingPoint;
  #router;
  constructor(
    controller = new CategoryController(),
    routeStartingPoint = '/category'
  ) {
    this.#router = Router();
    this.#controller = controller;
    this.#routeStartingPoint = routeStartingPoint;
    this.#initializedRoutes();
  }

  #initializedRoutes = () => {
    this.#router.get('/getAllCategories', this.#controller.getAllCategories);
  };

  getRouter = () => this.#router;

  getRouteStartingPoint = () => this.#routeStartingPoint;
}
