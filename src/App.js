import { useEffect, useState } from "react";
import Finder from "./components/Finder";
import MapComponent from "./components/Map";
import "./styles.css";
import "./loader.css"

export default function App() {

  const [citiesSuggestions, setCitiesSuggestions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch(`https://geo.api.gouv.fr/communes`);
        const cities = await response.json();

        const cityNames = Array.from(new Set(cities.map(city => city.nom)));

        setCitiesSuggestions(cityNames);
        setLoaded(true);
      } catch (err) {
        console.error(err);
        setLoaded(true)
      }
    }

    fetchCities();
  }, []);


  return (
    loaded ? (
      <div className="App">
        <div
          style={{
            position: 'absolute',
            top: '2%',
            left: '5%',
            zIndex: 999,
          }}
        >
          <Finder citiesSuggestions={citiesSuggestions} />
        </div>
        <MapComponent />
      </div>
    ) : (
      <div class="loader-container">
        <div class="three-body">
          <div class="three-body__dot"></div>
          <div class="three-body__dot"></div>
          <div class="three-body__dot"></div>
        </div>
      </div>
    )

  );
}