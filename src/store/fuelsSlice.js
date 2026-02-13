import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedFuelSort: null,
};

const fuelsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    setSelectedFuelSort(state, action) {
      state.selectedFuelSort = action.payload; // Met à jour la station sélectionnée
    },
  },
});

export const { setSelectedFuelSort } = fuelsSlice.actions; // Export des actions
export default fuelsSlice.reducer; // Export du reducer
