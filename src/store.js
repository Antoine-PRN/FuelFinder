import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  // theme: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        token: action.payload,
      };
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