require('dotenv').config();
const connectDB = require('./db/connect.js');
const Card = require('./models/Card.js');
const allCardsJSON = require('./all-cards.json');

const editedCardsJSON = allCardsJSON.data.map((card) => {
    const {id, ...otherProps} = card;
    const new_card = {card_id: id, ...otherProps};
    return new_card;
});
//console.log(editedCardsJSON[0]);

const populate = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");
        await Card.deleteMany();
        await Card.create(editedCardsJSON);
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
populate();