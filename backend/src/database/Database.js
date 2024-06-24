import mongoose from 'mongoose';
export default class Database {
  #uri;

  constructor(uri) {
    this.#uri = uri;
  }

  connect = async () => {
    try {
      await mongoose.connect(this.#uri);
      console.log(`Connection to the database was successful: ${this.#uri}`);
    } catch (e) {
      console.log(`Connection to the database failed: ${e.message}`);
    }
  };

  disconnect = async () => {
    mongoose.disconnect();
  };
}
