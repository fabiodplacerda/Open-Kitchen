import { model, Schema } from 'mongoose';

const recipeSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  imgUrl: { type: String, required: true },
  description: { type: String, required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
});

const Recipe = model('Recipe', recipeSchema);

export default Recipe;
