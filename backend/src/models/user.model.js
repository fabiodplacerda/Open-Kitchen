import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  Recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
});

const User = model('User', userSchema);

export default User;
