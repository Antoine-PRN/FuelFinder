import React from "react";
import electricIcon from "/icones/fuels/electric.svg";
import { formatDate } from "../../utils/functions";

const ElectricStationData = (props) => {
  return (
    <div className="sidebar-content">
      {/* Nom et adresse */}
      <h2>{props.selectedStationData?.fields?.n_station}</h2>
      <p>Adresse : {props.selectedStationData?.fields?.ad_station}</p>
      {/* Dernière mise à jour */}
      <div className="maj">
        <p>
          Dernière mise à jour : {formatDate(props.selectedStationData?.record_timestamp)}
        </p>
      </div>
      {/* Prix des carburants disponibles */}
      <div className="electric-prices">
        <h3>Informations sur la recharge :</h3>
        <p>
          <img alt="Icone electrique" src={electricIcon} />
          Type de prise : {props.selectedStationData.fields.type_prise}
        </p>
        <p>
          <img alt="Icone electrique" src={electricIcon} />
          Accès à la recharge :{" "}
          {props.selectedStationData.fields.acces_recharge}
        </p>
        <p>
          <img alt="Icone electrique" src={electricIcon} />
          Nombre de points de charge :{" "}
          {props.selectedStationData.fields.nbre_pdc}
        </p>
        <p>
          <img alt="Icone electrique" src={electricIcon} />
          Puissance maximum : {props.selectedStationData.fields.puiss_max} kW
        </p>
      </div>
      {/* Horaires */}
      <div className="opening-hours">
        <h3>Horaires :</h3>
        {props.selectedStationData?.fields?.accessibilite ? (
          props.selectedStationData?.fields?.accessibilite
        ) : (
          <p>Horaires non disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default ElectricStationData;
