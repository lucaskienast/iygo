import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_AVATARS_BEGIN,
  GET_AVATARS_SUCCESS,
  GET_AVATARS_ERROR,
  GET_SINGLE_AVATAR_BEGIN,
  GET_SINGLE_AVATAR_SUCCESS,
  GET_SINGLE_AVATAR_ERROR
} from '../actions'

const avatars_reducer = (state, action) => {
  if (action.type === SIDEBAR_OPEN) {
    return {...state, isSidebarOpen: true};
  }
  if (action.type === SIDEBAR_CLOSE) {
    return {...state, isSidebarOpen: false};
  }
  if (action.type === GET_AVATARS_BEGIN) {
    return {...state, avatarsLoading: true};
  }
  if (action.type === GET_AVATARS_SUCCESS) {
    const featuredAvatars = action.payload.slice(0, 5);
    return {...state, 
      avatarsLoading: false,
      avatars: action.payload,
      featuredAvatars
    };
  }
  if (action.type === GET_AVATARS_ERROR) {
    return {...state, 
      avatarsLoading: false,
      avatarsError: true
    };
  }
  if (action.type === GET_SINGLE_AVATAR_BEGIN) {
    return {...state, 
      singleAvatarLoading: true,
      singleAvatarError: false
    };
  }
  if (action.type === GET_SINGLE_AVATAR_SUCCESS) {
    return {...state, 
      singleAvatarLoading: false,
      singleAvatar: action.payload
    };
  }
  if (action.type === GET_SINGLE_AVATAR_ERROR) {
    return {...state, 
      singleAvatarLoading: false,
      singleAvatarError: true
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`)
}

export default avatars_reducer
