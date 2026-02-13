import React, { useState } from 'react';
import '../../style/actionButton.css'; // Ajoutez une feuille de style dédiée
import { FUELS_DATA } from '../../utils/constants.js'; // Importez les logos des carburants
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedFuelSort } from '../../store/fuelsSlice'; // Importez l'action pour mettre à jour le carburant sélectionné
import Tooltip from '@mui/material/Tooltip';

const ActionButton = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const selectedFuelSort = useSelector((state) => state.fuels.selectedFuelSort); // Récupère le carburant sélectionné
  const dispatch = useDispatch();

  const handleButtonClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setFilterOpen(false); // Ouvre ou ferme le sous-menu de filtrage
    setIsMenuOpen(!isMenuOpen); // Ouvre ou ferme le menu
  };

  const handleRecenterClick = () => {
    props.recentrerCarte(); // Appelle la fonction passée en prop
    setIsMenuOpen(false); // Ferme le menu après l’action
  };

  const handleFilterClick = () => {
    setFilterOpen(!filterOpen); // Ouvre ou ferme le sous-menu de filtrage
  }

  const handleFilterByFuel = (fuel) => {
    dispatch(setSelectedFuelSort(fuel)); // Met à jour le carburant sélectionné
    props.filterStationsByPrice(fuel) // Appelle la fonction passée en prop
    setFilterOpen(false); // Ferme le sous-menu de filtrage
    setIsMenuOpen(false); // Ferme le menu après l’action
  }

  return (
    <div className="action-button-container">
      <button className="action-button" onClick={handleButtonClick}>
        <img src="https://img.icons8.com/m_rounded/200/FFFFFF/settings.png" alt="Settings" />
      </button>
      {isMenuOpen && (
        !filterOpen ? (
          <div className="menu">
            <Tooltip title={"Recentrer"} placement="left">
              <button className="menu-item" onClick={handleRecenterClick}>
                <img src="https://cdn-icons-png.flaticon.com/128/60/60834.png" alt="Recentrer" />
              </button>
            </Tooltip>
            {selectedFuelSort ? (
              <Tooltip title={"Supprimer le filtre"} placement="left">
                <button className="menu-item" onClick={handleFilterClick}>
                  <img src={selectedFuelSort.path} alt="filtrer" />
                </button>
              </Tooltip>
            ) : (
              <Tooltip title={"Filtrer les prix"} placement="left">
                <button className="menu-item" onClick={handleFilterClick}>
                  <img src="https://cdn-icons-png.flaticon.com/128/4502/4502383.png" alt="filtrer" />
                </button>
              </Tooltip>
            )}
          </div>
        ) : (
          <div className="menu">
            {FUELS_DATA.map((fuel) => (
              <Tooltip title={fuel.short_name} placement="left">
                <button
                  key={fuel.id}
                  data-tooltip-id="fuel-tooltip" // ID partagé pour un seul Tooltip
                  data-tooltip-content={fuel.short_name} // Contenu dynamique pour chaque bouton
                  className="menu-item"
                  onClick={() => handleFilterByFuel(fuel)}
                >
                  <img src={fuel.path} alt={fuel.name} />
                </button>
              </Tooltip>
            ))}
            {selectedFuelSort && (
              <button
                className="menu-item"
                onClick={() => handleFilterByFuel(null)}
                data-tooltip-id="fuel-tooltip"
                data-tooltip-content="Supprimer le filtre" // Tooltip spécifique pour ce bouton
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/8238/8238032.png"
                  alt="Supprimer le filtre"
                />
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default ActionButton;
