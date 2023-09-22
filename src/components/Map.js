import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import { Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import Prices from './Prices';

export default function MapComponent({ mapCenter, userLocation }) {
  console.log('mapCenter: ', mapCenter);
  const [fuelStationData, setFuelStationData] = useState([]);
  const map = useMap();

  const customPumpIcon = new Icon({
    iconUrl: require('../images/icon.png'),
    iconSize: [37, 40],
  });

  const customLocationIcon = new Icon({
    iconUrl: require('../images/position.png'),
    iconSize: [20, 20],
  });

  useEffect(() => {
    async function fetchFuelStationData() {
      try {
        const response = await fetch(`https://api.prix-carburants.2aaz.fr/stations/around/${mapCenter[0]},${mapCenter[1]}?opendata=v2`);
        const data = await response.json();
        setFuelStationData(data);
      } catch (err) {
        console.log(err)
      }
    }

    map.setView(mapCenter);

    fetchFuelStationData();
  }, [mapCenter, map]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {fuelStationData.map((station) => (
        <Marker
          key={station.id}
          position={[parseFloat(station.geom.lat), parseFloat(station.geom.lon)]}
          icon={customPumpIcon}
        >
          <Popup>
            <Prices station={station} />
          </Popup>
        </Marker>
      ))}
      <Marker position={userLocation} icon={customLocationIcon}>
        <Popup>Vous êtes ici</Popup>
      </Marker>
    </>
  )
}