import PersonIcon from '@mui/icons-material/Person';
import { Button } from '@mui/material';

export default function Profile() {
  return (
    <div>
      <Button
        style={{ background: 'white', color: '#5d3fd3', display: 'flex', alignItems: 'center' }}
      >
        <PersonIcon />
        <span className="text">Profil</span>
      </Button>

      <style jsx>{`
        @media (max-width: 768px) {
          .text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}