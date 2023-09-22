import { Button } from "@mui/material";

export default function Prices({ station }) {
  return (
    <div>
      <div>
        <h3>{station.adresse}</h3>
        {station.e10_prix === "null" || undefined ? undefined : <p>E10: {station.e10_prix}€</p>}
        {station.e85_prix === "null" || undefined ? undefined : <p>E85: {station.e85_prix}€</p>}
        {station.gazole_prix === "null" || undefined ? undefined : <p>Gazole: {station.gazole_prix}€</p>}
        {station.sp95_prix === "null" || undefined ? undefined : <p>Sp 95: {station.sp95_prix}€</p>}
        {station.sp98_prix === "null" || undefined ? undefined : <p>Sp 98: {station.sp98_prix}€</p>}
        {station.carburants_disponibles === null ? (
          <p>Aucune disponibilité</p>
        ) : undefined}
      </div>
      <div>
        <Button size='small' onClick={() => undefined}>S'y rendre</Button>
      </div>
    </div>
  )
}