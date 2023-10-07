import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  refresh_token: null,
  user: null,
  profile: null,
  // theme: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        token: action.payload,
      };
    case 'SET_REFRESH_TOKEN':
      return {
        ...state,
        refresh_token: action.refresh_token,
      }
    case 'SET_USER' : 
      return {
        ...state,
        user: action.user
      }
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.profile
      }
    default:
      return state;
  }
};

const Store = configureStore({
  reducer: {
    store: reducer,
  },
});

export default Store;