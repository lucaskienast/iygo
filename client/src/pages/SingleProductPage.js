import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductsContext } from '../context/products_context';
import { single_product_url as url } from '../utils/constants';
import {
  Loading,
  Error,
  ProductImages,
  AddToCart,
  PageHero,
} from '../components';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SingleProductPage = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const {
    singleCardLoading: loading,
    singleCardError: error,
    singleCard: card,
    fetchSingleCard
  } = useProductsContext();

  useEffect(() => {
    fetchSingleCard(`${url}${id}`);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
    // eslint-disable-next-line
  }, [error]);

  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error />
  }

  const {
    name,
    type,
    desc,
    race,
    //archetype,
    card_images
  } = card;

  return (
    <Wrapper>
      <PageHero title={name} card />
      <div className='section section-center page'>
        <div className='product-center'>
          <ProductImages images={card_images} />
          <section className='content'>
            <h2>{name}</h2>
            <p className='desc'>{desc}</p>
            <p className='info'>
              <span>Type : </span>
              {type}
              <span>Race : </span>
              {race}
            </p>
            <hr />
            <br />
            <AddToCart card={card}/>
          </section>
        </div>
        <br />
        <br />
        <textarea readOnly value={JSON.stringify(card, null, '\t')} />
        <Link to='/products' className='btn'>
          back to cards
        </Link>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  .product-center {
    display: grid;
    gap: 4rem;
    margin-top: 2rem;
  }
  textarea {
    width: 100%;
    height: 500px;
    resize: none;
    background: #f0f0f0;
    color: grey;
    border-radius: var(--radius);
  }
  .price {
    color: var(--clr-primary-5);
  }
  .desc {
    line-height: 2;
    max-width: 45em;
  }
  .info {
    text-transform: capitalize;
    width: 300px;
    display: grid;
    grid-template-columns: 125px 1fr;
    span {
      font-weight: 700;
    }
  }

  @media (min-width: 992px) {
    .product-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
    .price {
      font-size: 1.25rem;
    }
  }
`

export default SingleProductPage
