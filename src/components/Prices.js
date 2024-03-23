export default function Prices({ station }) {
  return (
    <div style={{ padding: '5px' }}>
      <div>
        <div className="image_container">
          <img alt={station.Brand.name} src={require(`../images/brands/${station.Brand.id}.png`)} style={{ height: '100%' }} />
        </div>

        <h2>{station.adresse}</h2>
        {station.carburants_disponibles === null ? (
          <p style={{ fontSize: '15px' }}>Aucune disponibilité</p>
        ) : (
          <div>
            {station.e10_prix !== "null" && < p style={{ fontSize: '15px' }}>E10:  {station.e10_prix}€</p>}
            {station.e85_prix !== "null" && < p style={{ fontSize: '15px' }}>E85: {station.e85_prix}€</p>}
            {station.gazole_prix !== "null" && < p style={{ fontSize: '15px' }}>Gazole:  {station.gazole_prix}€</p>}
            {station.sp95_prix !== "null" && < p style={{ fontSize: '15px' }}> Sp 95:  {station.sp95_prix}€</p >}
            {station.sp98_prix !== "null" && < p style={{ fontSize: '15px' }}> Sp 98:  {station.sp98_prix}€</p >}
          </div >
        )}
      </div >
    </div >
  )
}
