import React from "react";
import { useSelector } from "react-redux";
import "../../style/sidebar.css";
import { BRANDS_LOGO } from "../../utils/constants.js"; // Import des logos des marques
import { selectStation } from "../../store/stationsSlice";
import { useDispatch } from "react-redux";
import FuelStationData from "./FuelStationData.jsx";
import ElectricStationData from "./ElectricStationData.jsx";

const Sidebar = () => {
  const selectedStation = useSelector(
    (state) => state.stations.selectedStation
  );
  const isElectric = useSelector((state) => state.stations.isElectric);
  const [selectedStationData, setSelectedStationData] = React.useState(null); // Informations de la station sélectionnée
  const dispatch = useDispatch();

  console.log(selectedStation);

  React.useEffect(() => {
    const fetchStationData = async (station) => {
      try {
        const response = await fetch(
          `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records?refine=id:${station.id}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSelectedStationData(data.results[0]);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de la station :",
          error
        );
      }
    };

    if (selectedStation) {
      if (!isElectric) {
        fetchStationData(selectedStation);
      }
    }
  }, [selectedStation]);

  return (
    <div className={`sidebar ${selectedStation ? "sidebar--open" : ""}`}>
      <div className="container">
        <button onClick={() => dispatch(selectStation(null))}>
          <img
            src="https://cdn-icons-png.flaticon.com/128/6927/6927542.png"
            alt="Retour"
          />
        </button>
      </div>
      {selectedStation && selectedStationData ? (
        !!selectedStationData ? (
          isElectric ? (
            <ElectricStationData selectedStationData={selectedStation} />
          ) : (
            <FuelStationData selectedStationData={selectedStationData} />
          )
        ) : (
          <div className="sidebar-placeholder">
            <p>Aucune données à afficher.</p>
          </div>
        )
      ) : (
        <div className="sidebar-placeholder">
          <p>Sélectionnez une station pour voir les détails.</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
