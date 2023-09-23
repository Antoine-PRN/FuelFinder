import { Button } from "@mui/material";

export default function Prices({ station }) {

  return (
    <div>
      <div>
        <h3>{station.adresse}</h3>
        {station.carburants_disponibles === null ? (
          <p>Aucune disponibilité</p>
        ) : (
          <div>
            <p>E10: {station.e10_prix === "null" ? "-- " : station.e10_prix}€</p>
            <p>E85: {station.e85_prix === "null" ? "-- " : station.e85_prix}€</p>
            <p>Gazole: {station.gazole_prix === "null" ? "-- " : station.gazole_prix}€</p>
            <p>Sp 95: {station.sp95_prix === "null" ? "-- " : station.sp95_prix}€</p>
            <p>Sp 98: {station.sp98_prix === "null" ? "-- " : station.sp98_prix}€</p>
          </div>
        )}
      </div>
      <div>
        <Button size='small' onClick={() => { /* votre logique de redirection ici */ }}>S'y rendre</Button>
      </div>
    </div>
  )
}
