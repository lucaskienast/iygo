const Card = require('../../models/Card.js');

const getCards = (inputs) => {
    const {
        type,
        race,
        attribute,
        name,
        numericFilters,
    } = inputs;
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
    let result = Card.find(queryObject);
    return result;
}

module.exports = {getCards};