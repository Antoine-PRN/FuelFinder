import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Button } from '@mui/material';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
// import L from 'leaflet';
import 'leaflet-routing-machine';
// import { Routing } from 'react-leaflet-routing-machine';

export default function MapComponent() {

  const [userLocation, setUserLocation] = useState(null)
  const [fuelStationsData, setFuelStationData] = useState([])
  // const [selectedStation, setSelectedStation] = useState(null)
  // const mapRef = useRef(null);
  // const initialPosition = [47.6426902, 6.8396775]

  const customPumpIcon = new Icon({
    iconUrl: require('../images/icon.png'),
    iconSize: [37, 40],
  });

  const customLocationIcon = new Icon({
    iconUrl: require('../images/position.png'),
    iconSize: [20, 20],
  });
  

  useEffect(() => {
    async function fetchUserLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (userPosition) {
          const userLat = userPosition.coords.latitude;
          const userLon = userPosition.coords.longitude;

          setUserLocation([userLat, userLon]);
          fetchFuelStations(userLat, userLon);
        })
      }
    }

    async function fetchFuelStations(userLat, userLon) {
      try {
        // Récupération de la ville
        const localisation = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${userLat[0]}&longitude=${userLon[1]}`);
        const town = await localisation.json();
        const city = town.city;
        console.log(city)

        if (!town) {
          console.error('Erreur de géolocalisation');
        }

        // Récupération des données des stations 
        const response = await fetch(`https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?where=search("${city}")`);
        const data = await response.json();
        console.log(data);
        setFuelStationData(data.results);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUserLocation();
  }, []);


  return (
    <div>
      {userLocation && (
        <MapContainer center={userLocation} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {fuelStationsData.map((station) => (
            <Marker
              key={station.id}
              position={[parseFloat(station.latitude) / 100000, parseFloat(station.longitude) / 100000]}
              icon={customPumpIcon}
            >
              <Popup>
                <div>
                  <div>
                    <h3>{station.adresse}</h3>
                    {station.e10_prix ? <p>E10: {station.e10_prix}€</p> : undefined}
                    {station.e85_prix ? <p>E85: {station.e85_prix}€</p> : undefined}
                    {station.gazole_prix ? <p>Gazole: {station.gazole_prix}€</p> : undefined}
                    {station.glpc_prix ? <p>GLPc: {station.glpc_prix}€</p> : undefined}
                    {station.sp95_prix ? <p>Sp 95: {station.sp95_prix}€</p> : undefined}
                    {station.sp98_prix ? <p>Sp 98: {station.sp98_prix}€</p> : undefined}
                    {station.carburants_disponibles === null ? (
                      <p>Aucune disponibilité</p>
                    ) : undefined}
                  </div>
                  <div>
                    <Button size='small' onClick={undefined}>S'y rendre</Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          {userLocation && (
            <Marker position={userLocation} icon={customLocationIcon}>
              <Popup>Vous êtes ici</Popup>
            </Marker>
          )}

          {/* {userLocation && selectedStation && (
            <Routing
              map={mapRef.current}
              position={userLocation}
              destination={[
                parseFloat(selectedStation.latitude) / 100000,
                parseFloat(selectedStation.longitude) / 100000,
              ]}
              waypoints={[
                {
                  lat: userLocation[0],
                  lon: userLocation[1],
                },
                {
                  lat: parseFloat(selectedStation.latitude) / 100000,
                  lon: parseFloat(selectedStation.longitude) / 100000,
                },
              ]}
            />
          )} */}
        </MapContainer>
      )}

    </div>
  )
}