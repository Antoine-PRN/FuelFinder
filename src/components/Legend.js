export default function Legend({ selectedFuel }) {
  return (
    selectedFuel ? (
      <>
        <div>
          <p>🟢 : Prix bas</p>
        </div>
        <div>
          <p>🟡 : Prix intermédiaire</p>
        </div>
        <div>
          <p>🔴 : Prix élevés</p>
        </div>
        <div>
          <p>⚫ : Pas de prix</p>
        </div>
      </>
    ) : (
      <>
        <div>⚫ : Pas de prix</div>
      </>)
  )
}