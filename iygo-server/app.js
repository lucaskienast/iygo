const dotenv = require("dotenv");
dotenv.config();
require('express-async-errors');
const express = require('express');
const app = express();

const connectDB = require('./db/connect.js');
const cardsRouter = require('./routes/cards.js');
const authRouter = require('./routes/auth.js');
// const authMiddleware = require("./middleware/authentication.js");
const notFoundMiddleware = require('./middleware/not-found.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');

// middleware
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.send("IYGO API");
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cards', /*authMiddleware,*/ cardsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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
}
start();