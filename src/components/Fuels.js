export default function Fuels() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '60px',
      justifyContent: 'space-around',
      background: 'red'
    }}>
      <div className='fuel-item'>
        Gazole
      </div>
      <div className='fuel-item'>
        essence
      </div>
      <div className='fuel-item'>
        essence
      </div>
    </div>
  )
}