import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import reducer from '../reducers/products_reducer';
import { products_url as url } from '../utils/constants';
import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_CARDS_BEGIN,
  GET_CARDS_SUCCESS,
  GET_CARDS_ERROR,
  GET_SINGLE_CARD_BEGIN,
  GET_SINGLE_CARD_SUCCESS,
  GET_SINGLE_CARD_ERROR
} from '../actions';

const initialState = {
  isSidebarOpen: false,
  cardsLoading: false,
  cardsError: false,
  cards: [],
  featuredCards: [],
  singleCardLoading: false,
  singleCardError: false,
  singleCard: {}
};

const ProductsContext = React.createContext();

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openSidebar = () => {
    dispatch({type: SIDEBAR_OPEN});
  };

  const closeSidebar = () => {
    dispatch({type: SIDEBAR_CLOSE});
  };

  const fetchCards = async(url) => {
    dispatch({type: GET_CARDS_BEGIN});
    try {
      const response = await axios.get(url);
      const cards = response.data.cards;
      dispatch({type: GET_CARDS_SUCCESS, payload: cards});
    } catch (error) {
      dispatch({type: GET_CARDS_ERROR});
    }
  };

  const fetchSingleCard = async(url) => {
    dispatch({type: GET_SINGLE_CARD_BEGIN});
    try {
      const response = await axios.get(url);
      const card = response.data.card;
      dispatch({type: GET_SINGLE_CARD_SUCCESS, payload: card});
    } catch (error) {
      dispatch({type: GET_SINGLE_CARD_ERROR});
    }
  }

  useEffect(() => {
    fetchCards(`${url}`);
  }, []);

  return (
    <ProductsContext.Provider 
      value={{...state, 
        openSidebar, 
        closeSidebar,
        fetchSingleCard
    }}>
      {children}
    </ProductsContext.Provider>
  )
}
// make sure use
export const useProductsContext = () => {
  return useContext(ProductsContext)
}
