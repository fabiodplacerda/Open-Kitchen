import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export default class UserServices {
  createAccount = async newUser => {
    try {
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashedPassword;
      const user = new User(newUser);
      return await user.save();
    } catch (e) {
      throw new Error(`Failed to create a new user: ${e.message}`);
    }
  };
}
