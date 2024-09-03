import Server from './server/Server.js';
import Config from './config/Config.js';
import Database from './database/Database.js';
import UserRoutes from './routes/User.routes.js';
import RecipeRoutes from './routes/Recipes.routes.js';
import ReviewRoutes from './routes/Review.routes.js';
import CategoryRoutes from './routes/Category.routes.js';

Config.loadConfig();
const { PORT, HOST, URI } = process.env;

const userRoutes = new UserRoutes();
const recipeRoutes = new RecipeRoutes();
const reviewRoutes = new ReviewRoutes();
const categoryRoutes = new CategoryRoutes();

const server = new Server(PORT, HOST, [
  userRoutes,
  recipeRoutes,
  reviewRoutes,
  categoryRoutes,
]);
const database = new Database(URI);

server.start();
database.connect();
