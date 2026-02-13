import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector, useDispatch } from "react-redux";
import { selectStation, toggleElectric } from "../../store/stationsSlice";
import ActionButton from "./ActionButton";
import {
  markerIcon,
  selectedMarkerIcon,
  selectedElectricMarkerIcon,
  topStationIcon,
  userMarkerIcon,
  bottomStationIcon,
  electricStationIcon,
} from "../../utils/markerIcons";
import { toast } from "sonner";
import { getPostCode } from "../../utils/functions";

const Map = () => {
  const [fuelStations, setFuelStations] = useState([]);
  const [electricStations, setElectricStations] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [top5Stations, setTop5Stations] = useState([]);
  const [bottom5Stations, setBottom5Stations] = useState([]);
  const mapRef = useRef(null);
  const selectedStation = useSelector(
    (state) => state.stations.selectedStation
  );
  const selectedFuelSort = useSelector((state) => state.fuels.selectedFuelSort);
  const dispatch = useDispatch();

  const fetchStations = async (latitude, longitude) => {
    try {
      const postCode = await handleUserLocation(latitude, longitude);
      const electricResponse = await fetch(
        `https://odre.opendatasoft.com/api/records/1.0/search/?dataset=bornes-irve&geofilter.distance=${latitude},${longitude},10000&limit=50`
      );
      const response = await fetch(
        `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?geofilter.distance=${latitude},${longitude},10000&where=code_departement='${postCode}'&limit=100`
      );

      if (response.ok && electricResponse.ok) {
        const fuelData = await response.json();
        const electricData = await electricResponse.json();

        const newFuelStations =
          fuelData && fuelData.results ? fuelData.results : [];
        const newElectricStations =
          electricData && electricData.records ? electricData.records : [];

        setFuelStations((prevStations) => {
          const uniqueStations = [...prevStations];
          newFuelStations.forEach((station) => {
            const exists = uniqueStations.some(
              (s) =>
                s.latitude === station.latitude &&
                s.longitude === station.longitude
            );
            if (!exists) {
              uniqueStations.push(station);
            }
          });
          return uniqueStations;
        });

        setElectricStations((prevStations) => {
          const uniqueStations = [...prevStations];
          newElectricStations.forEach((station) => {
            const exists = uniqueStations.some(
              (s) =>
                s.fields.ylatitude === station.fields.ylatitude &&
                s.fields.xlongitude === station.fields.xlongitude
            );
            if (!exists) {
              uniqueStations.push(station);
            }
          });
          return uniqueStations;
        });
      } else {
        console.error(
          "Error fetching stations:",
          response.status,
          electricResponse.status
        );
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const getUserLocation = () =>
    new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting user location:", error);
            resolve({
              lat: 47.316667,
              lng: 5.016667,
            });
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        resolve({
          lat: 47.316667,
          lng: 5.016667,
        });
      }
    });

  const MapEventsHandler = () => {
    const map = useMapEvents({
      moveend: () => {
        const center = map.getCenter();
        const latitude = center.lat;
        const longitude = center.lng;

        if (debounceTimer) clearTimeout(debounceTimer);
        setDebounceTimer(
          setTimeout(() => {
            fetchStations(latitude, longitude);
            filterStationsByPrice(selectedFuelSort);
          }, 500)
        );
      },
    });
    return null;
  };

  const recentrerCarte = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 13); // Zoom ajustable
    }
  };

  const handleStationClick = (station, isElectric = false) => {
    // Pour les stations électriques, utiliser recordid en priorité, sinon id_station
    const stationId = isElectric
      ? station.recordid || station.fields.id_station
      : station.id;

    // Créer une version normalisée de la station
    const normalizedStation = isElectric
      ? {
          ...station,
          id: stationId, // Utiliser l'ID normalisé
          fields: {
            ...station.fields,
          },
          isElectric: true,
        }
      : {
          ...station,
          isElectric: false,
        };

    // Vérifier si on clique sur la station déjà sélectionnée
    if (selectedStation && selectedStation.id === stationId) {
      dispatch(selectStation(null));
      dispatch(toggleElectric(false));
    } else {
      dispatch(selectStation(normalizedStation));
      dispatch(toggleElectric(isElectric));

      // Centrer la carte sur la station sélectionnée
      if (mapRef.current) {
        const targetLat = isElectric
          ? station.fields.ylatitude
          : station.latitude * 10 ** -5;
        const targetLng = isElectric
          ? station.fields.xlongitude
          : station.longitude * 10 ** -5;
        mapRef.current.flyTo([targetLat, targetLng], 14);
      }
    }
  };

  const filterStationsByPrice = async (selectedFuel) => {
    if (selectedFuel === null) {
      setTop5Stations([]);
      setBottom5Stations([]);
      return;
    }

    if (!selectedFuel || !selectedFuel["price-key"]) {
      console.error(
        "Le carburant sélectionné est invalide ou ne contient pas de clé de prix."
      );
      return;
    }

    // Filtrer les stations ayant une valeur valide pour le carburant sélectionné
    const filteredStations = fuelStations.filter((station) => {
      const price = station[`${selectedFuel["price-key"]}`]; // Récupère le prix pour le carburant
      return price !== null && price !== undefined; // Garde les stations avec des prix valides
    });

    // Trier les stations par prix croissant
    const sortedStations = filteredStations.sort((a, b) => {
      const priceA = a[`${selectedFuel["price-key"]}`];
      const priceB = b[`${selectedFuel["price-key"]}`];
      return priceA - priceB;
    });

    setTop5Stations(sortedStations.slice(0, 5)); // Récupère les 5 premières stations

    // Trier les stations par prix décroissant pour les 5 plus chères
    const sortedExpensiveStations = [...filteredStations].sort((a, b) => {
      const priceA = a[`${selectedFuel["price-key"]}`];
      const priceB = b[`${selectedFuel["price-key"]}`];
      return priceB - priceA;
    });

    setBottom5Stations(sortedExpensiveStations.slice(0, 5)); // Mettre à jour les 5 plus chères
  };

  const handleUserLocation = async (latitude, longitude) => {
    try {
      const url = userLocation
        ? `https://nominatim.openstreetmap.org/reverse?lat=${userLocation.lat}&lon=${userLocation.lng}&format=json`
        : `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return getPostCode(data.address.postcode);
      }
    } catch (error) {
      toast.error("Error fetching user location:", error);
    }
  };

  useEffect(() => {
    getUserLocation().then((location) => {
      setUserLocation(location);
      fetchStations(location.lat, location.lng);
    });
  }, []);

  return (
    <MapContainer
      className="map-container"
      center={[47.316667, 5.016667]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
      ref={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventsHandler />
      {fuelStations.length > 0 &&
        fuelStations.map((station, index) => (
          <Marker
            key={`fuel-${station.id}-${index}`}
            position={[
              station.latitude * 10 ** -5,
              station.longitude * 10 ** -5,
            ]}
            icon={
              selectedStation?.id === station.id && !selectedStation?.isElectric
                ? selectedMarkerIcon
                : top5Stations.some((s) => s.id === station.id)
                ? topStationIcon
                : bottom5Stations.some((s) => s.id === station.id)
                ? bottomStationIcon
                : markerIcon
            }
            eventHandlers={{
              click: () => handleStationClick(station, false),
            }}
          />
        ))}
      {electricStations.length > 0 &&
        electricStations.map((station, index) => {
          const stationId = station.recordid || station.fields.id_station;
          return (
            <Marker
              key={`electric-${stationId}-${index}`}
              position={[station.fields.ylatitude, station.fields.xlongitude]}
              icon={
                selectedStation?.id === stationId && selectedStation?.isElectric
                  ? selectedElectricMarkerIcon
                  : electricStationIcon
              }
              eventHandlers={{
                click: () => handleStationClick(station, true),
              }}
            />
          );
        })}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userMarkerIcon}
        >
          <Popup>
            <strong>Votre position</strong>
          </Popup>
        </Marker>
      )}
      <ActionButton
        recentrerCarte={recentrerCarte}
        filterStationsByPrice={filterStationsByPrice}
      />
    </MapContainer>
  );
};

export default Map;
