import React, { useEffect, useContext, useReducer } from 'react';
import reducer from '../reducers/filter_reducer';
import {
  LOAD_CARDS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_CARDS,
  UPDATE_FILTERS,
  FILTER_CARDS,
  CLEAR_FILTERS,
} from '../actions';
import { useProductsContext } from './products_context';

const initialState = {
  filteredCards: [],
  allCards: [],
  gridView: true,
  sort: 'name-a',
  filters: {
    name: '',
    type: 'all',
    race: 'all',
    attribute: 'all',
    archetype: 'all',
    desc: '',
    atk: 0,
    min_atk: 0,
    max_atk: 0,
    def: 0,
    min_def: 0,
    max_def: 0,
    level: 0
  }
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
  const {cards} = useProductsContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: LOAD_CARDS, payload: cards });
  }, [cards]);

  useEffect(() => {
    dispatch({ type: FILTER_CARDS });
    dispatch({ type: SORT_CARDS });
  }, [cards, state.sort, state.filters]);

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

  const updateFilters = (e) => {   
    // text input
    let name = e.target.name;
    let value = e.target.value;
    if (['type'].includes(name)) {
      // button
      value = e.target.textContent;
    }
    if (['atk', 'def'].includes(name)) {
      value = Number(value);
    }
    dispatch({ type: UPDATE_FILTERS, payload: {name, value} });
  }

  const clearFilters = (e) => {
    dispatch({ type: CLEAR_FILTERS });
  }

  return (
    <FilterContext.Provider 
      value={{...state, 
        setGridView, 
        setListView, 
        updateSort,
        updateFilters,
        clearFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
// make sure use
export const useFilterContext = () => {
  return useContext(FilterContext);
}
