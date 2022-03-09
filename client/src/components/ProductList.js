import React from 'react'
import { useFilterContext } from '../context/filter_context'
import GridView from './GridView'
import ListView from './ListView'

const ProductList = () => {
  const {filteredCards: cards, gridView} = useFilterContext();
  
  if (cards.length < 1) {
    return (
      <h5 style={{textTransform: 'none'}}>
        Sorry, no cards matched the search criteria
      </h5>
    );
  }

  if (gridView === false) {
    return (
      <ListView cards={cards}></ListView>
    );
  }
  
  return (
    <GridView cards={cards}></GridView>
  );
}

export default ProductList
