import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_CARDS_BEGIN,
  GET_CARDS_SUCCESS,
  GET_CARDS_ERROR,
  GET_SINGLE_CARD_BEGIN,
  GET_SINGLE_CARD_SUCCESS,
  GET_SINGLE_CARD_ERROR
} from '../actions'

const products_reducer = (state, action) => {
  if (action.type === SIDEBAR_OPEN) {
    return {...state, isSidebarOpen: true};
  }
  if (action.type === SIDEBAR_CLOSE) {
    return {...state, isSidebarOpen: false};
  }
  if (action.type === GET_CARDS_BEGIN) {
    return {...state, cardsLoading: true};
  }
  if (action.type === GET_CARDS_SUCCESS) {
    const featuredCards = action.payload.slice(40, 45);
    return {...state, 
      cardsLoading: false,
      cards: action.payload,
      featuredCards
    };
  }
  if (action.type === GET_CARDS_ERROR) {
    return {...state, 
      cardsLoading: false,
      cardsError: true
    };
  }
  if (action.type === GET_SINGLE_CARD_BEGIN) {
    return {...state, 
      singleCardLoading: true,
      singleCardError: false
    };
  }
  if (action.type === GET_SINGLE_CARD_SUCCESS) {
    return {...state, 
      singleCardLoading: false,
      singleCard: action.payload
    };
  }
  if (action.type === GET_SINGLE_CARD_ERROR) {
    return {...state, 
      singleCardLoading: false,
      singleCardError: true
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`)
}

export default products_reducer
