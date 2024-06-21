import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export default class UserServices {
  createAccount = async newUser => {
    try {
      const userData = {
        ...newUser,
        password: await bcrypt.hash(newUser.password, 10),
      };
      const user = new User(userData);
      return await user.save();
    } catch (e) {
      throw new Error(`Failed to create a new user: ${e.message}`);
    }
  };
}
