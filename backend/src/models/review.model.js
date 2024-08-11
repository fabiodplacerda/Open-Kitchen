import { model, Schema } from 'mongoose';

const reviewSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  rating: { type: Number, required: true },
  recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true },
  date: { type: Date, default: Date.now },
});

const Review = model('Review', reviewSchema);

export default Review;
