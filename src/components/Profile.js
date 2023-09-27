import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Modal } from '@mui/material';
import { useState } from 'react';
import Login from './Login';
import Register from './Register';

export default function Profile() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const components = [<Login setIndex={setIndex} />, <Register setIndex={setIndex} />]

  return (
    <div>
      <Button
        style={{ background: 'white', color: '#5d3fd3', display: 'flex', alignItems: 'center' }}
        onClick={() => setOpen(true)}
      >
        <PersonIcon />
        <span className="text">Profil</span>
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} >
        <Box style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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