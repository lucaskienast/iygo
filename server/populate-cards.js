require('dotenv').config();
const axios = require('axios');
const connectDB = require('./db/connect.js');
const Card = require('./models/Card.js');

const populate = async () => {
    const url = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
    console.log("Downloading JSON from YGOPRODECK");
    const result = await axios.get(url);
    console.log(1);
    const allCardsYgoPro = result.data.data; 

    const editedCardsJSON = allCardsYgoPro.map((card) => {
        const {id, ...otherProps} = card;
        const new_card = {card_id: id, ...otherProps};
        return new_card;
    });
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