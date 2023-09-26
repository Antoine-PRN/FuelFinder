import { useEffect, useState } from "react";
import Finder from "./components/Finder";
import MapComponent from "./components/Map";
import "./style/styles.css";
import "./style/loader.css"
import "./style/legend.css"
import { MapContainer } from "react-leaflet";
import Fuels from "./components/Fuels";
import Legend from "./components/Legend";
import { Box } from "@mui/material";
import Profile from "./components/Profile";

export default function App() {

  const [citiesSuggestions, setCitiesSuggestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState([]);
  const [userLocation, setUserLocation] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState(null);

  useEffect(() => {
    async function fetchUserLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (userPosition) {
          const userLat = userPosition.coords.latitude;
          const userLon = userPosition.coords.longitude;
          setUserLocation([userLat, userLon]);
          setMapCenter([userLat, userLon]);
        });
      }
    }

    async function fetchCities() {
      try {
        const response = await fetch('http://localhost:5000/cities');
        const cities = await response.json();

        setCitiesSuggestions(cities);
        setLoaded(true);
      } catch (err) {
        console.error(err);
        setLoaded(false)
      }
    }
    fetchCities();
    fetchUserLocation();
  }, []);

  async function updateMapCenter(selection) {
    try {
      if (selection === 'Utiliser la localisation') {
        setMapCenter(userLocation);
      } else {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${selection}&type=municipality`);
        const data = await response.json();
        setMapCenter(data.features[0].geometry.coordinates.reverse());
      }

    } catch (err) {
      console.log(err)
    }
  }

  return (
    loaded ? (
      <div className="App">
        <div
          style={{
            position: 'absolute',
            top: '1.5%',
            left: '80px',
            zIndex: 999,
            width: '80%',
          }}
        >
          <Finder citiesSuggestions={citiesSuggestions} updateMapCenter={updateMapCenter} />
        </div>
        <Box flexGrow={1}/>
        <div style={{
          position: 'absolute',
          top: '3%',
          right: '20px',
          zIndex: 999,
        }}>
          <Profile />
        </div>
        <div style={{
          position: 'absolute',
          top: '1.5%',
          left: '12px',
          zIndex: 999,
        }}>
          <Fuels setSelectedFuel={setSelectedFuel} selectedFuel={selectedFuel} />
        </div>
        <div className="legend">
          <Legend selectedFuel={selectedFuel} />
        </div>
        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} zoomControl={false}>
          <MapComponent
            mapCenter={mapCenter}
            userLocation={userLocation}
            selectedFuel={selectedFuel}
          />
        </MapContainer>
      </div >
    ) : (
      <div className="loader-container">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
      </div>
    )
  );
}