import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import Login from './Login';
import Register from './Register';
import { useSelector } from 'react-redux';


export default function Profile() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const authenticated = useSelector(state => state.store.token);
  const refresh_token = useSelector(state => state.store.refresh_token);

  const components = [<Login setIndex={setIndex} setOpen={setOpen} />, <Register setIndex={setIndex} setOpen={setOpen} />]

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = fetch('http://localhost:5000/user/refresh_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "refresh_token": refresh_token
          })
        });
        console.log('test')
        if (response.status === 200) {
          const data = await response.json();
          console.log(data)
        }
      } catch(err) {
        console.log(err);
      }
    }

    fetchToken();
  }, [refresh_token])

  return (
    <div>
      <Button
        style={{ background: 'white', display: 'flex', alignItems: 'center', padding: '10px' }}
        onClick={() => setOpen(true)}
      >
        <PersonIcon />
        {authenticated ? (
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
        @media (max-width: 768px) {
          .text {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}