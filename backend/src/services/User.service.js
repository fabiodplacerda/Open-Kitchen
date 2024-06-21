import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
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
  accountLogin = async (username, password) => {
    try {
      // Find user in the database
      const foundUser = await User.findOne({ username: username });
      if (!foundUser) return null;

      // Match password using bcrypt
      const passwordMatch = await bcrypt.compare(password, foundUser.password);
      if (!passwordMatch) return null;
      const { password: _, ...userWithoutPassword } = foundUser;

      // Token
      const token = jwt.sign(
        { id: foundUser._id, username: userWithoutPassword.username },
        process.env.SECRET,
        {
          expiresIn: '24h',
        }
      );
      // Send the user and the token to the controller
      return { user: userWithoutPassword, token };
    } catch (e) {
      throw new Error(`Login failed: ${e.message}`);
    }
  };
  updateAccount = async (userId, updates) => {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    try {
      const updatedAccount = await User.findOneAndUpdate(
        { _id: userId },
        // $set only update the specified fields
        { $set: updates },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedAccount) {
        return null;
      }
      const { password, ...updatedAccountWithoutPassword } = updatedAccount;
      return updatedAccountWithoutPassword;
    } catch (e) {
      throw new Error(`Failed to update the user: ${e.message}`);
    }
  };
}
