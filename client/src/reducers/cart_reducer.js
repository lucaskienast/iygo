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
      return c.card_id === card.card_id;
    });
    if (tempItem) {

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
