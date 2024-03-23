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
  const [fuelStationData, setFuelStationData] = useState([]);

  async function fetchUserLocation() {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (userPosition) {
          const userLat = userPosition.coords.latitude;
          const userLon = userPosition.coords.longitude;
          resolve([userLat, userLon]);
        });
      } else {
        reject(new Error('La géolocalisation n\'est pas disponible.'));
      }
    });
  }
  
  async function fetchFuelStationData(userLocation) {
    return new Promise((resolve, reject) => {
      try {
        // Fetch fuel station data from the API
        fetch(`${process.env.REACT_APP_URI}/rest/fuels`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'latitude': userLocation[0],
            'longitude': userLocation[1],
          }
        })
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  }
  

  async function fetchCities() {
    try {
      const response = await fetch(`${process.env.REACT_APP_URI}/cities`);
      const cities = await response.json();

      setCitiesSuggestions(cities);
    } catch (err) {
      console.error(err);
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

  useEffect(() => {
    async function fetchData() {
      try {
        const userLocation = await fetchUserLocation();
        setUserLocation(userLocation);
        setMapCenter(userLocation);
    
        await fetchCities();
    
        const fuelStationDataResponse = await fetchFuelStationData(userLocation);
        const fuelStationData = fuelStationDataResponse; // Modification ici
        if (selectedFuel) {
          fuelStationData.sort((a, b) => a[selectedFuel.prix] - b[selectedFuel.prix]);
        }
        setFuelStationData(fuelStationData);
        setLoaded(true);
      } catch (error) {
        console.error(error);
      }
    }
  
    fetchData();
  }, []);
  

  return (
    loaded && fuelStationData.length > 0 ? (
      <div className="App">
        <Toaster richColors={true} />
        <Grid container spacing={3} style={{ padding: '1em', position: 'absolute', top: 0, left: 0, zIndex: 999 }}>
          <Grid item xl={6} md={8} xs={11} style={{ display: 'flex', alignItems: 'center' }}>
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
        {fuelStationData && fuelStationData.length > 0 && (
          <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} zoomControl={false}>
            <MapComponent
              mapCenter={mapCenter}
              userLocation={userLocation}
              selectedFuel={selectedFuel}
              fuelStationData={fuelStationData}
            />
          </MapContainer>
        )}
      </div >
    ) : (
      <Loader />
    )
  );
}