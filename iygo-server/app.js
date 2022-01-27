const dotenv = require("dotenv");
dotenv.config();
require('express-async-errors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const {printWelcomeMessage} = require('./helper');
const connectDB = require('./db/connect.js');
const cardsRouter = require('./routes/cardsRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const userRouter = require('./routes/userRoutes');
// const authMiddleware = require("./middleware/authentication.js");
const notFoundMiddleware = require('./middleware/not-found.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');

// middleware
app.set('trust proxy', 1); // for heroku deployment
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(fileUpload({useTempFiles: false}));

// routes
app.get('/', (req, res) => {
    res.send("IYGO API");
});
app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies);
    res.send("IYGO API");
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/cards', cardsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

printWelcomeMessage();
const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");
        app.listen(port, () => {
            return console.log(`Server is listening on port ${port}...`);
        });
    } catch(error) {
        console.log(error);
    }
};
start();