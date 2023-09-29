import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  refresh_token: null,
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