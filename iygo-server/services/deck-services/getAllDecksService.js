const Deck = require('../../models/Deck.js');
const Card = require('../../models/Card.js');

const getAllDecks = async (req, callback) => {
    // extend for avatar and cards with amount
    const {
        name,
        user,
        nbCards,
        sort,
        fields,
    } = req.query;
    const {cardFilters} = req.body;
    const queryObject = {};
    if (user) {
        queryObject.user = user;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }
    if (nbCards) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filter = nbCards.replace(regEx, (match) => {
            return `-${operatorMap[match]}-`;
        });
        const [operator, value] = filter.split('-');
        queryObject.nbCards = { [operator]: Number(value)};
    }
    let result = Deck.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }

    let decks = await result;

    if (cardFilters) {
        let cardSets = [];
        for(let i = 0; i < cardFilters.length; i++) {
            const amount = cardFilters[i].amount;
            const criteria = cardFilters[i].criteria;
            const {
                type,
                race,
                attribute,
                name,
                numericFilters,
                // user query option for future custom user-made cards
            } = criteria;
            const queryObject = {};
            if (type) {
                queryObject.type = type;
            }
            if (race) {
                queryObject.race = race;
            }
            if (attribute) {
                queryObject.attribute = attribute;
            }
            /*if (user) {
                // queryObject.created_by equals or includes given user
                // user from personal token or input if not self
            }*/
            if (name) {
                queryObject.name = { $regex: name, $options: 'i' };
            }
            if (numericFilters) {
                const operatorMap = {
                    '>': '$gt',
                    '>=': '$gte',
                    '=': '$eq',
                    '<': '$lt',
                    '<=': '$lte'
                };
                const regEx = /\b(<|>|>=|=|<|<=)\b/g;
                let filters = numericFilters.replace(regEx, (match) => {
                    return `-${operatorMap[match]}-`;
                });
                const options = ['atk', 'def', 'level', 'scale'];
                filters = filters.split(',').forEach((item) => {
                    const [field, operator, value] = item.split('-');
                    if (options.includes(field)) {
                        queryObject[field] = { 
                            [operator]: Number(value) 
                        };
                    }
                });
            }
            let result = Card.find(queryObject).select(['card_id']);
            const cards = await result;
            cardSets = [...cardSets, {amount, cards}];
        }
        let filteredDecks = [];
        for (let i = 0; i < decks.length; i++) {
            const deck = decks[i];
            let passedAllFilters = true;
            for (let j = 0; j < cardSets.length; j++) {
                let filterHits = 0;
                const cardSet = cardSets[j];
                const cardSetAmount = cardSet.amount;
                const setCards = cardSet.cards;
                const setCardIds = setCards.map((setCard) => setCard.card_id);
                for (let k = 0; k < deck.cards.length; k++) {
                    const deckCard = deck.cards[k];
                    for (let l = 0; l < deckCard.amount; l++) {
                        if (setCardIds.includes(deckCard.card_id)){
                            filterHits++;
                        }
                        if (filterHits >= cardSetAmount) {
                            break;
                        }
                    }
                    if (filterHits >= cardSetAmount) {
                        break;
                    }
                }
                if (filterHits < cardSetAmount) {
                    passedAllFilters = false;
                }
            }
            if (passedAllFilters === true) {
                filteredDecks = [...filteredDecks, deck];
            }
        }
        decks = filteredDecks;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    decks = decks.slice(skip, skip+limit);

    return callback({nbHits: decks.length, decks});
};

module.exports = {
    getAllDecks
}