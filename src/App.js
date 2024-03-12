import { useEffect, useState } from "react";
import Finder from "./components/Finder";
import MapComponent from "./components/Map";
import "./style/styles.css";
import "./style/loader.css"
import "./style/legend.css"
import { MapContainer } from "react-leaflet";
import Fuels from "./components/Fuels";
import Legend from "./components/Legend";
import { Grid } from "@mui/material";
import Profile from "./components/profile/Profile";
import Cookies from "js-cookie";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import Loader from "./Loader";

export default function App() {

  const [citiesSuggestions, setCitiesSuggestions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState([]);
  const [userLocation, setUserLocation] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState(null);
  const clientId = '520774578108-1umak1jhkcdja9c9pt9c76aoqc6ssksl.apps.googleusercontent.com'

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
        const response = await fetch(`${process.env.REACT_APP_URI}/cities`);
        const cities = await response.json();

        setCitiesSuggestions(cities);
        setLoaded(true);
      } catch (err) {
        console.error(err);
        setLoaded(false)
      }
    }

    async function getGoogleData() {
      try {
        const google_token = Cookies.get('google_token')
        if (google_token) {

        }
      } catch (err) {
        console.log(err)
      }
    }
    getGoogleData();
    fetchCities();
    fetchUserLocation();
  }, []);

  async function updateMapCenter(event, selection) {
    event.preventDefault();
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
        <Toaster richColors={true} />
        <Grid container spacing={3} style={{ padding: '1em', position: 'absolute', top: 0, left: 0, zIndex: 999 }}>
          <Grid item xl={6} md={8} xs={11}  style={{ display: 'flex', alignItems: 'center' }}>
            <Fuels setSelectedFuel={setSelectedFuel} selectedFuel={selectedFuel} />
            <Finder citiesSuggestions={citiesSuggestions} updateMapCenter={updateMapCenter} />
          </Grid>
          <Grid item xl={6} md={4} xs={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <GoogleOAuthProvider clientId={clientId}>
              <Profile />
            </GoogleOAuthProvider>
          </Grid>
        </Grid>
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
      <Loader />
    )
  );
}