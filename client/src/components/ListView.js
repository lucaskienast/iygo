import React from 'react';
import styled from 'styled-components';
import { formatPrice } from '../utils/helpers';
import { Link } from 'react-router-dom';

const ListView = ({cards}) => {
  return (
    <Wrapper>
      {cards.map((card) => {
        const {
          card_id,
          card_images, 
          name, 
          desc, 
          type, 
          race
        } = card;

        return (
          <article key={card_id}>
            <img src={card_images[0].image_url} alt={name} />
            <div>
              <h4>{name}</h4>
              <h5>Type: {type}</h5>
              <h5>Race: {race}</h5>
              <p>{desc}</p>
              <Link to={`/products/${card_id}`} className='btn'>
                Details
              </Link>
            </div>
          </article>
        );

      })}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: grid;
  row-gap: 1rem;

  img {
    width: 100%;
    display: block;
    width: 300px;
    height: 300px;
    object-fit: contain;
    border-radius: var(--radius);
    margin-bottom: 1rem;
  }
  h4 {
    margin-bottom: 0.5rem;
  }
  .price {
    color: var(--clr-primary-6);
    margin-bottom: 0.75rem;
  }
  p {
    max-width: 45em;
    margin-bottom: 1rem;
  }
  .btn {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
  }
  @media (min-width: 992px) {
    article {
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 2rem;
      align-items: center;
    }
  }
`

export default ListView
