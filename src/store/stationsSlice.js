import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedStation: null,
  isElectric: false,
};

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    selectStation(state, action) {
      state.selectedStation = action.payload; // Met à jour la station sélectionnée
    },
    toggleElectric(state, action) {
      state.isElectric = action.payload;
    },
  },
});

export const { selectStation, toggleElectric } = stationsSlice.actions; // Export des actions
export default stationsSlice.reducer; // Export du reducer
