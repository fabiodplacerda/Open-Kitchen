import express from 'express';
import cors from 'cors';

export default class Server {
  #app;
  #host;
  #port;
  #router;
  #server;

  constructor(port, host, router) {
    this.#app = express();
    this.#port = port;
    this.#host = host;
    this.#server = null;
    this.#router = router;
  }

  getApp = () => this.#app;

  start = () => {
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`Server in running on http://${this.#host}:${this.#port}`);
    });
    this.#app.use(express.json());
    this.#router.forEach(route => {
      this.#app.use(route.getRouteStartingPoint(), route.getRouter());
    });
  };

  close = () => {
    this.#server?.close();
  };
}
