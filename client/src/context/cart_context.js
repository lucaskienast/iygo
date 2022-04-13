import React, { useEffect, useContext, useReducer } from 'react'
import reducer from '../reducers/cart_reducer'
import {
  ADD_TO_DECK,
  REMOVE_FROM_DECK,
  TOGGLE_DECK_CARD_AMOUNT,
  CLEAR_DECK,
  COUNT_DECK_CARDS_TOTALS
} from '../actions'

const getLocalStorage = () => {
  let deck = localStorage.getItem('deck');
  if (deck) {
    return JSON.parse(deck);
  } else {
    return [];
  }
}

const initialState = {
  // general
  deck: getLocalStorage(),
  totalCards: 0,
  totalTraps: 0,
  totalSpells: 0,
  totalMonsters: 0,
  totalDiffCards: 0,
  // monsters
  totalNormalMonsters: 0,
  totalFusion: 0,
  totalRitual: 0,
  totalEffect: 0,
  totalFlipEffect: 0,
  total1800PlusAtk: 0,
  total1800PlusDef: 0,
  totalSpecialSummonMonster: 0,
  totalFiveOrMoreStars: 0,
  totalFourOrLessStars: 0,
  totalFourOrLessStars1800PlusAtk: 0,
  totalFourOrLessStars1800PlusDef: 0,
  // mana
  totalNormalMana: 0,
  totalEquip: 0,
  totalCounter: 0,
  totalQuickPlay: 0,
  totalContinuous: 0,
  totalSpecialSummonMana: 0
}

const CartContext = React.createContext()

export const CartProvider = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({type: COUNT_DECK_CARDS_TOTALS});
    localStorage.setItem('deck', JSON.stringify(state.deck));
  }, [state.deck]);

  const addToDeck = (card, amount) => {
    dispatch({type: ADD_TO_DECK, payload: {card, amount}});
  }

  const removeFromDeck = (card) => {
    dispatch({type: REMOVE_FROM_DECK, payload: card});
  }

  const toggleAmount = (card, value) => {
    dispatch({type: TOGGLE_DECK_CARD_AMOUNT, payload: {card, value}});
  }

  const clearDeck = () => {
    dispatch({type: CLEAR_DECK});
  }

  const countCards = () => {
    dispatch({type: COUNT_DECK_CARDS_TOTALS});
  }

  return (
    <CartContext.Provider 
      value={{...state, 
        addToDeck,
        removeFromDeck,
        toggleAmount,
        clearDeck,
        countCards
      }}>
      {children}
    </CartContext.Provider>
  )
}
// make sure use
export const useCartContext = () => {
  return useContext(CartContext)
}
