import {
  ADD_TO_DECK,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
} from '../actions'

const cart_reducer = (state, action) => {

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

  throw new Error(`No Matching "${action.type}" - action type`)
}

export default cart_reducer
