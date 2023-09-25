import { Button, Tooltip } from '@mui/material'
import '../style/fuelBar.css'
import none_icon from '../images/none_icon.png'
import diesel_icon from '../images/diesel_icon.png'
import sp95_icon from '../images/sp95_icon.png'
import sp98_icon from '../images/sp98_icon.png'
import sp95_e10_icon from '../images/sp95_e10_icon.png'
import e85_icon from '../images/e85_icon.png'

export default function Fuels({ setSelectedFuel, selectedFuel }) {
  const fuels = [
    { name: 'Aucun', icon: none_icon },
    {name: 'Ethanol', icon: e85_icon, prix: 'e85_prix'},
    { name: 'Sans plomb 95', icon: sp95_icon, prix: 'sp95_prix' },
    { name: 'Sans plomb 95 E10', icon: sp95_e10_icon, prix: 'e10_prix' },
    { name: 'Sans plomb 98', icon: sp98_icon, prix: 'sp98_prix' },
    { name: 'Diesel', icon: diesel_icon, prix: 'gazole_prix' },
  ];
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '60px',
      borderRadius: '5px',
      justifyContent: 'space-around',
      background: 'white'
    }}>
      {fuels.map((fuel) => (
        <div className='fuel-item' style={{ background: selectedFuel && selectedFuel.name === fuel.name ? 'rgba(114, 114, 114, .4)' : '' }}>
          <Tooltip title={fuel.name} placement='right'>
            <Button onClick={() => fuel.name === 'Aucun' ? setSelectedFuel(null) : setSelectedFuel(fuel)}>
              <img src={fuel.icon} alt={fuel.name} />
            </Button>
          </Tooltip>
        </div>
      ))}
    </div>
  )
}