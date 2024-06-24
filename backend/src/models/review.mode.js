import { model, Schema } from 'mongoose';

const reviewSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
});

const Review = model('Review', reviewSchema);

export default Review;
