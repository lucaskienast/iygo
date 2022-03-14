import { GiCardRandom } from 'react-icons/gi';
import {
  LOAD_CARDS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_CARDS,
  UPDATE_FILTERS,
  FILTER_CARDS,
  CLEAR_FILTERS,
} from '../actions'

const filter_reducer = (state, action) => {
  
  if (action.type === LOAD_CARDS) {
    let maxAtk = action.payload.map((card) => {
      if (card.atk) {
        return card.atk;
      }
      return 0;
    });
    maxAtk = Math.max(...maxAtk);
    maxAtk = isFinite(maxAtk) ? maxAtk : 0;
    let maxDef = action.payload.map((card) => {
      if (card.def) {
        return card.def;
      }
      return 0;
    });
    maxDef = Math.max(...maxDef);
    maxDef = isFinite(maxDef) ? maxDef : 0;
    return {...state,
      allCards: [...action.payload],
      filteredCards: [...action.payload],
      filters: {...state.filters, 
        max_atk: maxAtk, 
        atk: maxAtk,
        max_def: maxDef, 
        def: maxDef
      }
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
  if (action.type === UPDATE_FILTERS) {
    const {name, value} = action.payload;
    return {...state, 
      filters: {...state.filters,
        [name]: value
      }
    };
  }
  if (action.type === FILTER_CARDS) {
    const {allCards} = state;
    const {
      name,
      type,
      race,
      attribute,
      archetype,
      desc,
      atk,
      min_atk,
      max_atk,
      def,
      min_def,
      max_def,
      level
    } = state.filters;
    let tempCards = [...allCards];
    // filter cards
    if (name) {
      tempCards = tempCards.filter((card) => {
        return card.name.toLowerCase().startsWith(name);
      });
    }
    if (type !== 'all') {
      tempCards = tempCards.filter((card) => {
        return card.type === type;
      });
    }
    if (race !== 'all') {
      tempCards = tempCards.filter((card) => {
        return card.race === race;
      });
    }
    if (attribute !== 'all') {
      tempCards = tempCards.filter((card) => {
        return card.attribute === attribute;
      });
    }
     if (archetype !== 'all') {
      tempCards = tempCards.filter((card) => {
        return card.archetype === archetype;
      });
    }
    tempCards = tempCards.filter((card) => {
      if (card.atk) {
        return card.atk <= atk;
      }
      return 1;
    });
    tempCards = tempCards.filter((card) => {
      if (card.def) {
        return card.def <= def;
      }
      return 1;
    });
    return {...state,
      filteredCards: tempCards
    };
  }
  if (action.type === CLEAR_FILTERS) {
    return {...state, 
      filters: {
        ...state.filters,
        name: '',
        type: 'all',
        race: 'all',
        attribute: 'all',
        archetype: 'all',
        desc: '',
        atk: state.filters.max_atk,
        def: state.filters.max_def,
        level: 0
      }
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`)
}

export default filter_reducer
