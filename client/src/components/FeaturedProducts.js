import React from 'react'
import { useProductsContext } from '../context/products_context'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Error from './Error'
import Loading from './Loading'
import Product from './Product'

const FeaturedProducts = () => {
  
  const {
    cardsLoading: loading,
    cardsError: error,
    featuredCards: featured
  } = useProductsContext();

  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error />
  }
  return (
    <Wrapper className='section'>
      <div className='title'>
        <h2>Featured Cards</h2>
        <div className='underline'></div>
      </div>
      <div className='section-center featured'>
        {featured.map((card) => {
          return (
            <Product key={card.card_id} {...card} />
          );
        })}
      </div>
    </Wrapper>
  );

}

const Wrapper = styled.section`
  background: var(--clr-grey-10);
  .featured {
    margin: 4rem auto;
    display: flex;
    gap: 2.5rem;
    img {
      height: 325px;
    }
  }
  .btn {
    display: block;
    width: 148px;
    margin: 0 auto;
    text-align: center;
  }
  @media (min-width: 576px) {
    .featured {
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    }
  }
`

export default FeaturedProducts
