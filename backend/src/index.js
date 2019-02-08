const cookieParser = require('cookie-parser')
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createdServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());
//TODO use express middleware to populate current user

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
    }
}, deets => {
    console.log(`Server is running on port ${deets.port}`)
}
)