import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import { Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import Prices from './Prices';
import { BRANDS_IDS } from '../utils/constants';

/**
  * Render a map component with fuel station data and user location.
  *
  * @param {Object} props - The component props.
  * @param {Array} props.mapCenter - The coordinates of the map center.
  * @param {Array} props.userLocation - The coordinates of the user's location.
  * @param {string} props.selectedFuel - The selected fuel type (e.g., 'sp95' or 'gazole').
  * @returns {JSX.Element} - The map component.
  */
export default function MapComponent({ mapCenter, userLocation, selectedFuel, ...props }) {
  console.log(props.fuelStationData)
  // State for fuel station data

  // Get the map instance from the useMap hook
  const map = useMap();


  // Create icon for fuel station markers
  const MidpumpIcon = new Icon({
    iconUrl: require('../images/icon_mid.png'),
    iconSize: [37, 40],
  });

  const goodPumpIcon = new Icon({
    iconUrl: require('../images/icon_good.png'),
    iconSize: [37, 40],
  });

  const badPumpIcon = new Icon({
    iconUrl: require('../images/icon_bad.png'),
    iconSize: [37, 40],
  });

  const pumpIcon = new Icon({
    iconUrl: require('../images/icon.png'),
    iconSize: [37, 40],
  });

  const disabledPumpIcon = new Icon({
    iconUrl: require('../images/disabled_icon.png'),
    iconSize: [37, 40],
  })

  // Create icon for user location marker
  const locationIcon = new Icon({
    iconUrl: require('../images/position.png'),
    iconSize: [20, 20],
  });

  useEffect(() => {
    

    // Set the map view to the center coordinates
    map.setView(mapCenter);
  }, []);

  function getStationIcon(index) {
    const selectedFuelPrices = props.fuelStationData
      .map(getSelectedFuelPrices)

    selectedFuelPrices.sort();

    // Si dans les 5 premiers ET différente de null
    if (index < 6 && selectedFuelPrices[index] !== 'null') {
      return goodPumpIcon;
    }
    //  Si valeur null
    else if (selectedFuelPrices[index] === 'null') {
      return disabledPumpIcon;
    }
    //  Si dans les 5 plus élevé
    else if (selectedFuelPrices[index] !== null) {
      const top5Prices = selectedFuelPrices
        .filter(price => price !== null) // Filtrez les prix non nulls
        .sort((a, b) => b - a) // Triez du plus élevé au plus bas
        .slice(0, 6); // Obtenez les 5 premiers

      if (top5Prices.includes(selectedFuelPrices[index])) {
        return badPumpIcon;
      }
    }

    //  Si rien de tout ca
    return MidpumpIcon;
  }


  function getSelectedFuelPrices(station) {
    if (selectedFuel) {
      // Vérifiez si la station a des prix pour le carburant sélectionné
      if (station[selectedFuel.prix]) {
        return station[selectedFuel.prix];
      }
    }
    return null;
  }

  return (
    <>
      {/* OpenStreetMap tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render fuel station markers */}
      {props.fuelStationData.map((station, index) => {
        return (
          getSelectedFuelPrices(station),
          <Marker
            key={station.id}
            position={[parseFloat(station.geom.lat), parseFloat(station.geom.lon)]}
            icon={
              station.carburants_disponibles === null
                ? disabledPumpIcon
                : selectedFuel
                  ? getStationIcon(index)
                  : pumpIcon
            }
          >
            {/* Popup showing fuel station prices */}
            <Popup>
              <Prices station={station} selectedFuel={selectedFuel} />
            </Popup>
          </Marker>
        );
      })}

      {/* User location marker */}
      <Marker position={userLocation} icon={locationIcon}>
        <Popup>Vous êtes ici</Popup>
      </Marker>
    </>
  );
}
