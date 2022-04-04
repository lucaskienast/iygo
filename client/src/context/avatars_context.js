import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import reducer from '../reducers/avatars_reducer';
import { avatars_url as url } from '../utils/constants';
import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_AVATARS_BEGIN,
  GET_AVATARS_SUCCESS,
  GET_AVATARS_ERROR,
  GET_SINGLE_AVATAR_BEGIN,
  GET_SINGLE_AVATAR_SUCCESS,
  GET_SINGLE_AVATAR_ERROR
} from '../actions';

const initialState = {
  isSidebarOpen: false,
  avatarsLoading: false,
  avatarsError: false,
  avatars: [],
  featuredAvatars: [],
  singleAvatarLoading: false,
  singleAvatarError: false,
  singleAvatar: {}
};

const AvatarsContext = React.createContext();

export const AvatarsProvider = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const openSidebar = () => {
    dispatch({type: SIDEBAR_OPEN});
  };

  const closeSidebar = () => {
    dispatch({type: SIDEBAR_CLOSE});
  };

  const fetchAvatars = async(url) => {
    dispatch({type: GET_AVATARS_BEGIN});
    try {
      const response = await axios.get(url);
      const avatars = response.data.avatars;
      dispatch({type: GET_AVATARS_SUCCESS, payload: avatars});
    } catch (error) {
      dispatch({type: GET_AVATARS_ERROR});
    }
  };

  const fetchSingleAvatar = async(url) => {
    dispatch({type: GET_SINGLE_AVATAR_BEGIN});
    try {
      const response = await axios.get(url);
      const avatar = response.data.avatar;
      dispatch({type: GET_SINGLE_AVATAR_SUCCESS, payload: avatar});
    } catch (error) {
      dispatch({type: GET_SINGLE_AVATAR_ERROR});
    }
  }

  useEffect(() => {
    fetchAvatars(`${url}`);
  }, []);

  return (
    <AvatarsContext.Provider 
      value={{...state, 
        openSidebar, 
        closeSidebar,
        fetchSingleAvatar
    }}>
      {children}
    </AvatarsContext.Provider>
  )
}
// make sure use
export const useAvatarsContext = () => {
  return useContext(AvatarsContext)
}
