import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Review from '../models/review.model.js';
import Recipe from '../models/recipe.model.js';
import mongoose from 'mongoose';
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
      const foundUser = await User.findOne({ username: username })
        .populate('recipes')
        .populate('savedRecipes');
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
  deleteAccount = async userId => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await Review.deleteMany({ author: userId });
      await Recipe.deleteMany({ author: userId });
      const deleteUser = await User.findByIdAndDelete(userId);

      await session.commitTransaction();
      session.endSession();

      return deleteUser;
    } catch (e) {
      await session.abortTransaction();
      session.endSession();

      throw new Error(`Failed to delete the user: ${e.message}`);
    }
  };

  getAllAccounts = async () => {
    try {
      const users = await User.find();

      const usersWithoutPassword = users.map(user => {
        const userData = user._doc ? user._doc : user;
        const { password, ...userWithoutPassword } = userData;
        return userWithoutPassword;
      });

      return usersWithoutPassword;
    } catch (e) {
      throw new Error(`Failed to get all users: ${e.message}`);
    }
  };

  getSingleUser = async userId => {
    try {
      const user = await User.findById(userId, '-password')
        .populate('recipes')
        .populate('savedRecipes');

      if (!user) return null;

      return user;
    } catch (e) {
      throw new Error(`Failed to retrieved the user: ${e.message}`);
    }
  };
}
