import {
  ADD_TO_DECK,
  CLEAR_DECK,
  COUNT_DECK_CARDS_TOTALS,
  REMOVE_FROM_DECK,
  TOGGLE_DECK_CARD_AMOUNT,
} from '../actions'

const cart_reducer = (state, action) => {

  if (action.type === CLEAR_DECK) {
    return {...state, deck: []};
  }
  if (action.type === COUNT_DECK_CARDS_TOTALS) {
    const {totalCards} = state.deck.reduce((total, c) => {
      const {amount} = c;
      total.totalCards += amount;
      return total;
    }, {
      totalCards: 0
    });
    return {...state, totalCards}
  }
  if (action.type === TOGGLE_DECK_CARD_AMOUNT) {
    const {card, value} = action.payload;
    const tempDeck = state.deck.map((c) => {
      if (c.card.card_id === card.card_id) {
        if (value === 'inc') {
          let newAmount = c.amount + 1;
          if (newAmount > 5) {
            newAmount = 5;
          }
          return {...c, amount: newAmount};
        }
        if (value === 'dec') {
          let newAmount = c.amount - 1;
          if (newAmount < 1) {
            newAmount = 1;
          }
          return {...c, amount: newAmount};
        }
      }
      return c;
    });
    return {...state, deck: tempDeck};
  }
  if (action.type === ADD_TO_DECK) {
    const {card, amount} = action.payload;
    const tempItem = state.deck.find((c) => {
      return c.card.card_id === card.card_id;
    });
    if (tempItem) {
      const tempDeck = state.deck.map((c) => {
        if (c.card.card_id === card.card_id) {
          let newAmount = c.amount + amount;
          if (newAmount > 5) {
            newAmount = 5;
          }
          return {...c, amount: newAmount};
        } else {
          return c;
        }
      });

      return {...state, deck: tempDeck};
    } else {
      const newItem = {
        card,
        amount
      };
      return {...state, deck: [...state.deck, newItem]};
    }
  }
  if (action.type === REMOVE_FROM_DECK) {
    const tempDeck = state.deck.filter((c) => {
      return c.card.card_id !== action.payload.card_id;
    });
    return {...state, deck: tempDeck};
  }

  throw new Error(`No Matching "${action.type}" - action type`)
}

export default cart_reducer
