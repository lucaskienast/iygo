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
          <div>
            <article key={card_id}>
              <Link to={`/products/${card_id}`}>
                <img src={card_images[0].image_url} alt={name} />
                </Link>
              <div>
                <h5>{name}</h5>
                <p>Type: {type}</p>
                <p>Race: {race}</p>
                <br/>
                <p>{desc}</p>
              </div>
            </article>
            <hr/>
          </div>
        );

      })}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: grid;
  row-gap: 0rem;

  img {
    width: 100%;
    display: block;
    width: 170px;
    height: 270px;
    object-fit: contain;
    border-radius: var(--radius);
    margin-bottom: 0rem;
  }
  h5 {
    margin-bottom: 1rem;
  }
  .price {
    color: var(--clr-primary-6);
  }
  p {
    font-size: 14px;
    max-width: 45em;
    margin-bottom: 0rem;
  }
  .btn {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
    margin-top: 1rem;
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
