const express = require('express');
const app = express();
const cards = require('./routes/cards.js');
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require('./db/connect.js');
const notFound = require('./middleware/not-found.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');

// middleware
app.use(express.json());

// routes
app.use('/api/v1/cards', cards);
app.use(notFound);
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