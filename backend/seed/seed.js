import Config from '../src/config/Config.js';
import Database from '../src/database/Database.js';
import User from '../src/models/user.model.js';
import Recipe from '../src/models/recipe.model.js';
import Review from '../src/models/review.model.js';
import reviewsData from './data/reviewsData.js';
import recipesData from './data/recipesData.js';
import userData from './data/userData.js';

Config.loadConfig();

const { URI } = process.env;
const database = new Database(URI);
database.connect();

try {
  await User.deleteMany();
  await Recipe.deleteMany();
  await Review.deleteMany();
  await User.insertMany(userData);
  await Recipe.insertMany(recipesData);
  await Review.insertMany(reviewsData);
  console.log('Database was seeded');
} catch (e) {
  console.log(`Error seeding the database: ${e.message}`);
} finally {
  database.disconnect();
}
