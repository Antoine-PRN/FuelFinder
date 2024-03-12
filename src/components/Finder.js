import Paper from '@mui/material/Paper';
import { Autocomplete, IconButton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

export default function Finder({ citiesSuggestions, updateMapCenter }) {
  const [inputValue, setInputValue] = useState('');
  const [paperWidth, setPaperWidth] = useState(window.innerWidth <= 900 ? '35vw' : '25vw');

  const handleResize = () => {
    setPaperWidth(window.innerWidth <= 900 ? '35vw' : '25vw');
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const filterAndSortCities = (inputValue) => {
    if (inputValue.length < 3) {
      return ['Utiliser la localisation'];
    }

    return citiesSuggestions
      .filter((city) =>
        typeof inputValue === 'string' && city.toLowerCase().includes(inputValue.toLowerCase())
      )
      .sort();
  };

  return (
    <Paper
      className='finder'
      style={{ width: paperWidth, marginLeft: '1vw', padding: '2px 4px' }}
    >
      <form style={{ width: '100%' }} onSubmit={(event) => updateMapCenter(event, inputValue)}>
        <Autocomplete
          id="city-search"
          freeSolo
          fullWidth
          options={filterAndSortCities(inputValue)}
          onInputChange={(event, newValue) => {
            setInputValue(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={'Chercher une ville'}
              sx={{ p: 1 }}
              margin="none"
              variant="standard"
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <IconButton
                    type="button"
                    sx={{ p: '10px', whiteSpace: 'nowrap' }}
                    aria-label="search"
                    onClick={(event) => updateMapCenter(event, inputValue)}
                  >
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          )}
        />
      </form>
    </Paper>
  );
}
