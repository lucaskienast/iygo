import React from 'react'
import styled from 'styled-components'
import { useCartContext } from '../context/cart_context'
import { Link } from 'react-router-dom'
import { CartContent, PageHero } from '../components'

const CartPage = () => {

  const {deck} = useCartContext();

  if (deck.length < 1) {
    return (
      <Wrapper className='page-100'>
        <div className='empty'>
          <h2>Deck is empty</h2>
          <Link to='/products' className='btn'>
            Add cards
          </Link>
        </div>
      </Wrapper>
    );
  }
  
  return (
    <main>
      <PageHero title='deck' />
      <Wrapper className='page'>
        <CartContent />
      </Wrapper>
    </main>
  );
}

const Wrapper = styled.main`
  .empty {
    text-align: center;
    h2 {
      margin-bottom: 2rem;
      text-transform: none;
    }
  }
`

export default CartPage
