import Server from './Server/Server.js';
import Config from './config/Config.js';
import Database from './database/Database.js';

Config.loadConfig();
const { PORT, HOST, URI } = process.env;

const server = new Server(PORT, HOST);
const database = new Database(URI);

server.start();
database.connect();
