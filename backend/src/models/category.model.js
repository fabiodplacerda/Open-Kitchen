import { model, Schema } from 'mongoose';

const categorySchema = new Schema({
  categoryName: { type: String, required: true },
});

const Category = model('Category', categorySchema);

export default Category;
