import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import { Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import Prices from './Prices';

/**
  * Render a map component with fuel station data and user location.
  *
  * @param {Object} props - The component props.
  * @param {Array} props.mapCenter - The coordinates of the map center.
  * @param {Array} props.userLocation - The coordinates of the user's location.
  * @param {string} props.selectedFuel - The selected fuel type (e.g., 'sp95' or 'gazole').
  * @returns {JSX.Element} - The map component.
  */
export default function MapComponent({ mapCenter, userLocation, selectedFuel }) {
  // State for fuel station data
  const [fuelStationData, setFuelStationData] = useState([]);

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

  /**
   * Fetch fuel station data from API, sort it, and update state.
   */
  useEffect(() => {
    async function fetchFuelStationData() {
      try {
        const response = await fetch(`https://api.prix-carburants.2aaz.fr/stations/around/${mapCenter[0]},${mapCenter[1]}?opendata=v2`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Range': 'station=1-20'
          }
        });
        const data = await response.json();
        data.filter((station, index, self) => {
          console.log(station.adresse)
          return index === self.findIndex((s) => s.adresse === station.adresse);
        });
        // console.log(data);

        if (selectedFuel) {
          // Sort the data based on the selected fuel price
          data.sort((a, b) =>
            a[`${selectedFuel.prix}`] - b[`${selectedFuel.prix}`]);
          console.log(data);
        }

        setFuelStationData(data);
      } catch (error) {
        console.log(error);
      }
    }

    // Set the map view to the center coordinates
    map.setView(mapCenter);

    // Fetch fuel station data and sort it
    fetchFuelStationData();
  }, [mapCenter, map, selectedFuel]);

  function getStationIcon(index) {
    if (index < 5) {
      return goodPumpIcon; // The 3 cheapest stations get the "good" icon
    } else if (index >= fuelStationData.length - 5) {
      return badPumpIcon; // The 3 most expensive stations get the "bad" icon
    } else {
      return MidpumpIcon; // All other stations get the "normal" icon
    }
  }

  return (
    <>
      {/* OpenStreetMap tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render fuel station markers */}
      {fuelStationData.map((station, index) => (
        <Marker
          key={station.id}
          position={[parseFloat(station.geom.lat), parseFloat(station.geom.lon)]}
          icon={station.carburants_disponibles === null ? (disabledPumpIcon) : (selectedFuel ? (getStationIcon(index)) : pumpIcon)} // You may want to change this icon based on station data
        >
          {/* Popup showing fuel station prices */}
          <Popup>
            <Prices station={station} selectedFuel={selectedFuel} />
          </Popup>
        </Marker>
      ))}

      {/* User location marker */}
      <Marker position={userLocation} icon={locationIcon}>
        <Popup>Vous êtes ici</Popup>
      </Marker>
    </>
  );
}
