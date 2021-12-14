const express = require('express');
const app = express();
const allCardsJSON = require('./all-cards.json');
const logger = require('./logger');
const authorize = require('./authorize');

// http://localhost:5000/api/v1/cards/?user=lucas
app.use([logger, authorize]);

app.get("/", (req, res) => {
    res.status(200).send("Home page");
});

app.get("/about", (req, res) => {
    res.status(200).send("About page");
});

app.get("/rawCards", (req, res) => {
    res.status(200).json(allCardsJSON);
});

app.get('/api/v1/cards', (req, res) => {
    const allCards = allCardsJSON.data.map((card) => {
        const {id, name, type} = card;
        return {id, name, type};
    });
    res.json(allCards);
});

app.get('/api/v1/cards/:cardID', (req, res) => {
    const { cardID } = req.params;
    const singleCard = allCardsJSON.data.find((card) => {
        return card.id === Number(cardID);
    });
    if(!singleCard) {
        return res.status(404).send("Card does not exist!");
    }
    return res.status(200).json(singleCard);
});

app.get("/api/v1/query", (req, res) => {
    //http://localhost:5000/api/v1/query/?search=Blue&limit=3
    const { search, limit } = req.query;
    let sortedCards = [...allCardsJSON.data];
    if (search) {
        sortedCards = sortedCards.filter((card) => {
            return card.name.startsWith(search);
        });
    }
    if (limit) {
        sortedCards = sortedCards.slice(0, Number(limit));
    }
    if (sortedCards.length < 1) {
        return res.status(200).json({success: true, data: []});
    }
    return res.status(200).json({success: true, data: sortedCards});
});

app.all("*", (req, res) => {
    res.status(404).send('<h1>Page not found!</h1>');
});

app.listen(5000, () => {
    console.log("Server is listening to port 5000...");
});