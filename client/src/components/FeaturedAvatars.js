import React from 'react';
import { useAvatarsContext } from '../context/avatars_context';
import styled from 'styled-components';
import Error from './Error';
import Loading from './Loading';
import AvatarsHome from './AvatarsHome';

const FeaturedAvatars = () => {
  
  const {
    avatarsLoading: loading,
    avatarsError: error,
    featuredAvatars: featured
  } = useAvatarsContext();

  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error />
  }
  return (
    <Wrapper className='section'>
      <div className='title'>
        <h2>Featured Avatars</h2>
        <div className='underline'></div>
      </div>
      <div className='section-center featured'>
        {featured.map((avatar) => {
          return (
            <AvatarsHome key={avatar._id} {...avatar} />
          );
        })}
      </div>
    </Wrapper>
  );

}

const Wrapper = styled.section`
  background: var(--clr-white);
  .featured {
    margin: 4rem auto;
    display: flex;
    gap: 2.5rem;
    img {
      height: 470px;
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

export default FeaturedAvatars
