import { Button } from "@mui/material";

export default function Prices({ station }) {

  return (
    <div style={{ padding: '5px' }}>
      <div >
        <h2>{station.adresse}</h2>
        {station.carburants_disponibles === null ? (
          <p style={{ fontSize: '15px' }}>Aucune disponibilité</p>
        ) : (
          <div>
            <p style={{ fontSize: '15px' }}>E10: {station.e10_prix === "null" ? "-- " : station.e10_prix}€</p>
            <p style={{ fontSize: '15px' }}>E85: {station.e85_prix === "null" ? "-- " : station.e85_prix}€</p>
            <p style={{ fontSize: '15px' }}>Gazole: {station.gazole_prix === "null" ? "-- " : station.gazole_prix}€</p>
            <p style={{ fontSize: '15px' }}>Sp 95: {station.sp95_prix === "null" ? "-- " : station.sp95_prix}€</p>
            <p style={{ fontSize: '15px' }}>Sp 98: {station.sp98_prix === "null" ? "-- " : station.sp98_prix}€</p>
          </div>
        )}
      </div>
      {/* <div>
        <Button size='small' >S'y rendre</Button>
      </div> */}
    </div>
  )
}
