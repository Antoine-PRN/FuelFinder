import React from "react";
import { getAvailableFuels, getHours, getLastUpdate } from "../../utils/functions";
import { FUELS_DATA, SERVICES_LOGO } from "../../utils/constants";

const FuelStationData = (props) => {
  return (
    <div className="sidebar-content">
      {/* Nom et adresse */}
      <h2>{props.selectedStationData?.ville}</h2>
      <p>Adresse : {props.selectedStationData?.adresse}</p>
      {/* Dernière mise à jour */}
      <div className="maj">
        <p>
          Dernière mise à jour :{" "}
          {getLastUpdate(props.selectedStationData) || "Non renseignée"}
        </p>
      </div>
      {/* Prix des carburants disponibles */}
      <div className="fuel-prices">
        <h3>Carburants disponibles :</h3>
        {props.selectedStationData?.prix?.length > 0 ? (
          <ul>
            {getAvailableFuels(props.selectedStationData.prix).map((fuel) => (
              <li key={fuel.id}>
                <img
                  src={
                    FUELS_DATA.find(
                      (fuelIcon) => fuelIcon.short_name === fuel.name
                    )?.path || "default-icon.png"
                  }
                  alt={`Icône de ${fuel.name}`}
                />
                {fuel.name} : {fuel.value || "Prix non renseigné"}€
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun carburant disponible.</p>
        )}
      </div>
      {/* Horaires */}
      <div className="opening-hours">
        <h3>Horaires :</h3>
        {props.selectedStationData?.horaires?.length > 0 ? (
          <ul>
            {getHours(
              props.selectedStationData.horaires,
              props.selectedStationData.horaires_jour
            ).map((day) => (
              <li key={day.day}>
                {day.name} :
                {day.openingTime === "N/A" && day.closingTime === "N/A" ? (
                  <span> Non défini</span>
                ) : (
                  <span>
                    {day.openingTime} - {day.closingTime}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Horaires non disponibles.</p>
        )}
      </div>
      {/* Services proposés */}
      <div className="services">
        <h3>Services :</h3>
        {props.selectedStationData?.services_service &&
        props.selectedStationData?.services_service.length > 0 ? (
          <ul>
            {props.selectedStationData.services_service.map((service, index) => {
              const serviceIcon =
                SERVICES_LOGO.find(
                  (serviceIcon) => serviceIcon.label === service
                )?.path || "default-icon.png";
              return (
                <li key={index}>
                  <img
                    src={serviceIcon}
                    alt={`Icône de ${service}`}
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "8px",
                    }} // Exemple de styles
                  />
                  {service}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Aucun service disponible.</p>
        )}
      </div>
    </div>
  );
};

export default FuelStationData;
