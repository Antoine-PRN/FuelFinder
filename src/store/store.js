import { configureStore } from '@reduxjs/toolkit';
import stationsReducer from './stationsSlice'; // Exemple : Un reducer pour les stations
import fuelsReducer from './fuelsSlice'; // Exemple : Un reducer pour les carburants

// Configuration du store
const store = configureStore({
  reducer: {
    stations: stationsReducer, // Ajouter d'autres reducers ici
    fuels: fuelsReducer,
  },
});

export default store;
