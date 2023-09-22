import Paper from '@mui/material/Paper';
import { Autocomplete, IconButton, TextField } from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

export default function Finder({ citiesSuggestions, updateMapCenter }) {
  const [inputValue, setInputValue] = useState('');

  // Function to filter and sort city suggestions based on user input
  const filterAndSortCities = (inputValue) => {
    if (inputValue.length < 3) {
      return ['Utiliser la localisation']; // Retourner un tableau vide si moins de 3 caractères
    }

    return  citiesSuggestions
      .filter((city) =>
        typeof inputValue === 'string' && city.toLowerCase().includes(inputValue.toLowerCase())
      )
      .sort();
  };

  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 300,
      }}
    >
      <div sx={{ width: '100%' }}>
        <Autocomplete
          id="city-search"
          freeSolo
          options={filterAndSortCities(inputValue)}
          onInputChange={(event, newValue) => {
            setInputValue(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder='Chercher une ville'
              sx={{ width: 290, p: 1 }}
              margin="none"
              variant="standard"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <IconButton
                    type="button"
                    sx={{ p: '10px' }}
                    aria-label="search"
                    onClick={() => updateMapCenter(inputValue)}
                  >
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          )}
        />
      </div>
    </Paper>
  );
}
