import React, { useState } from 'react';
import { Button, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close'; // Importez l'icône de croix
import '../style/fuelBar.css';
import none_icon from '../images/none_icon.png';
import diesel_icon from '../images/diesel_icon.png';
import sp95_icon from '../images/sp95_icon.png';
import sp98_icon from '../images/sp98_icon.png';
import sp95_e10_icon from '../images/sp95_e10_icon.png';
import e85_icon from '../images/e85_icon.png';
import { useSelector } from 'react-redux';

export default function Fuels({ setSelectedFuel, selectedFuel }) {

  const fuels = [
    { name: 'Aucun', icon: none_icon },
    { name: 'Ethanol', icon: e85_icon, prix: 'e85_prix' },
    { name: 'Sans plomb 95', icon: sp95_icon, prix: 'sp95_prix' },
    { name: 'Sans plomb 95 E10', icon: sp95_e10_icon, prix: 'e10_prix' },
    { name: 'Sans plomb 98', icon: sp98_icon, prix: 'sp98_prix' },
    { name: 'Diesel', icon: diesel_icon, prix: 'gazole_prix' },
  ];
  const premium = useSelector(state => state.store.premium)
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (fuel) => {
    setAnchorEl(null);
    if (fuel && fuel.name !== 'Aucun') {
      setSelectedFuel(fuel);
    } else {
      setSelectedFuel(null);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '60px',
      height: '65px',
      borderRadius: '5px',
      justifyContent: 'space-around',
      background: 'white',
    }}>
      <Tooltip title="Sélectionnez le carburant" placement="right">
        <Button onClick={handleClick} style={{ height: '100%' }}>
          {selectedFuel ? (
            <img src={selectedFuel.icon} alt={selectedFuel.name} />
          ) : (
            anchorEl ? <CloseIcon style={{ color: 'red' }} /> : <MenuIcon style={{ color: 'black' }} />
          )}
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
      >
        {premium === null ? (
          <Typography style={{ margin: '10px' }}>
            Contenu vérouillé
          </Typography>
        ) : (
          fuels.map((fuel) => (
            <MenuItem
              key={fuel.name}
              onClick={() => handleClose(fuel)}
              selected={selectedFuel && selectedFuel.name === fuel.name}
            >
              <img src={fuel.icon} alt={fuel.name} style={{ marginRight: '10px' }} />
              {fuel.name}
            </MenuItem>
          ))
        )}

      </Menu>
    </div>
  );
}
