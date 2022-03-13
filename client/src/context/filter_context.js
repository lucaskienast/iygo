import React, { useEffect, useContext, useReducer } from 'react';
import reducer from '../reducers/filter_reducer';
import {
  LOAD_CARDS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_CARDS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions';
import { useProductsContext } from './products_context';

const initialState = {
  filteredCards: [],
  allCards: [],
  gridView: true,
  sort: 'name-a'
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
  const {cards} = useProductsContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: LOAD_CARDS, payload: cards });
  }, [cards]);

  useEffect(() => {
    dispatch({ type: SORT_CARDS });
  }, [cards, state.sort]);

  const setGridView = () => {
    dispatch({ type: SET_GRIDVIEW });
  }

  const setListView = () => {
    dispatch({ type: SET_LISTVIEW });
  }

  const updateSort = (event) => {
    // const name = event.target.name;
    const value = event.target.value;
    dispatch({ type: UPDATE_SORT, payload: value });
  }

  return (
    <FilterContext.Provider 
      value={{...state, setGridView, setListView, updateSort }}
    >
      {children}
    </FilterContext.Provider>
  );
}
// make sure use
export const useFilterContext = () => {
  return useContext(FilterContext);
}
