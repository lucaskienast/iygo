import {
  LOAD_CARDS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_CARDS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions'

const filter_reducer = (state, action) => {
  
  if (action.type === LOAD_CARDS) {
    return {...state,
      allCards: [...action.payload],
      filteredCards: [...action.payload]
    }
  }
  if (action.type === SET_GRIDVIEW) {
    return {...state, gridView: true};
  }
  if (action.type === SET_LISTVIEW) {
    return {...state, gridView: false};
  }
  if (action.type === UPDATE_SORT) {
    return {...state, sort: action.payload};
  }
  if (action.type === SORT_CARDS) {
    const {sort, filteredCards} = state;
    let tempCards = [...filteredCards];
    if (sort === 'name-a') {
      tempCards = tempCards.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
    if (sort === 'name-z') {
      tempCards = tempCards.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }
    return {...state, filteredCards: tempCards};
  }
  throw new Error(`No Matching "${action.type}" - action type`)
}

export default filter_reducer
