import express from 'express';
import cors from 'cors';

export default class Server {
  #app;
  #host;
  #port;
  #router;
  #server;

  constructor(port, host) {
    this.#app = express();
    this.#port = port;
    this.#host = host;
    this.#server = null;
  }

  getApp = () => this.#app;

  start = () => {
    this.#server = this.#app.listen(this.#port, this.#host, () => {
      console.log(`Server in running on http://${this.#host}:${this.#port}`);
    });
  };

  close = () => {
    this.#server?.close();
  };
}
