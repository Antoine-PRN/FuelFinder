import PersonIcon from '@mui/icons-material/Person';
import { Badge, Box, Button, Modal } from '@mui/material';
import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { useSelector } from 'react-redux';
import ProfileData from './ProfileData';
import StarIcon from '@mui/icons-material/Star';

export default function Profile() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const authenticated = useSelector(state => state.store.token);
  const googleProfile = useSelector(state => state.store.profile)
  const no_ads = useSelector(state => state.store.no_ads);

  const components = [
    <Login setIndex={setIndex} setOpen={setOpen} />,
    <Register setIndex={setIndex} setOpen={setOpen} />,
    <ProfileData setOpen={setOpen} setIndex={setIndex} />,
  ]

  return (
    <div>
      <Button
        style={{ background: 'white', display: 'flex', alignItems: 'center', padding: '10px', height: '100%' }}
        onClick={() => {
          (authenticated || googleProfile) && setIndex(2);
          setOpen(true);
        }}
      >
        <PersonIcon />
        {authenticated || googleProfile ? (
          <span className="text" color='primary'>Profil</span>
        ) : (
          <span className="text">Se connecter</span>
        )}
      </Button>


      <Modal open={open} onClose={() => setOpen(false)} >
        <Box style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {components[index]}
        </Box>
      </Modal>

      <style jsx>{`
        @media (max-width: 900px) {
          .text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
