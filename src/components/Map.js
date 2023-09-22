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
 * @returns {JSX.Element} - The map component.
 */
export default function MapComponent({ mapCenter, userLocation }) {
  // State for fuel station data
  const [fuelStationData, setFuelStationData] = useState([]);

  // Get the map instance from the useMap hook
  const map = useMap();

  // Create icon for fuel station markers
  const pumpIcon = new Icon({
    iconUrl: require('../images/icon_mid.png'),
    iconSize: [37, 40],
  });

  const goodPumpIcon = new Icon({
    iconUrl: require('../images/icon_good.png'),
    iconSize: [37, 40],
  })

  const badPumpIcon = new Icon({
    iconUrl: require('../images/icon_bad.png'),
    iconSize: [37, 40],
  })

  // Create icon for user location marker
  const locationIcon = new Icon({
    iconUrl: require('../images/position.png'),
    iconSize: [20, 20],
  });

  /**
   * Fetch fuel station data from API and update state.
   */
  useEffect(() => {
    async function fetchFuelStationData() {
      try {
        const response = await fetch(`https://api.prix-carburants.2aaz.fr/stations/around/${mapCenter[0]},${mapCenter[1]}?opendata=v2`);
        const data = await response.json();
        setFuelStationData(data);
      } catch (error) {
        console.log(error);
      }
    }

    // Set the map view to the center coordinates
    map.setView(mapCenter);

    // Fetch fuel station data
    fetchFuelStationData();
  }, [mapCenter, map]);

  return (
    <>
      {/* OpenStreetMap tile layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render fuel station markers */}
      {fuelStationData.map((station) => (
        <Marker
          key={station.id}
          position={[parseFloat(station.geom.lat), parseFloat(station.geom.lon)]}
          icon={pumpIcon}
        >
          {/* Popup showing fuel station prices */}
          <Popup>
            <Prices station={station} />
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
