import Server from './Server/Server.js';
import Config from './config/Config.js';
import Database from './database/Database.js';
import UserRoutes from './routes/User.routes.js';

Config.loadConfig();
const { PORT, HOST, URI } = process.env;

const userRoutes = new UserRoutes();

const server = new Server(PORT, HOST, [userRoutes]);
const database = new Database(URI);

server.start();
database.connect();
