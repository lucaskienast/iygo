import React, { useEffect, useContext, useReducer } from 'react'
import reducer from '../reducers/cart_reducer'
import {
  ADD_TO_DECK,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
  CLEAR_CART,
  COUNT_CART_TOTALS,
} from '../actions'

const initialState = {
  // general
  deck: [],
  totalCards: 0,
  totalTraps: 0,
  totalSpells: 0,
  totalMonsters: 0,
  totalDiffCards: 0,
  // monsters
  totalNormal: 0,
  totalFusion: 0,
  totalRitual: 0,
  totalEffect: 0,
  totalFlipEffect: 0,
  total1800PlusAtk: 0,
  total1800PlusDef: 0,
  totalSpecialSummon: 0,
  totalFiveOrMoreStars: 0,
  totalFourOrLessStars: 0,
  totalFourOrLessStars1800PlusAtk: 0,
  totalFourOrLessStars1800PlusDef: 0,
  // mana
  totalNormal: 0,
  totalEquip: 0,
  totalCounter: 0,
  totalQuickPlay: 0,
  totalContinuous: 0,
  totalSpecialSummon: 0
}

const CartContext = React.createContext()

export const CartProvider = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const addToDeck = (card, amount) => {
    dispatch({type: ADD_TO_DECK, payload: {card, amount}});
  }

  return (
    <CartContext.Provider value={{...state, addToDeck}}>
      {children}
    </CartContext.Provider>
  )
}
// make sure use
export const useCartContext = () => {
  return useContext(CartContext)
}
