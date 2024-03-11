import React, { useState } from 'react';
import { Box, IconButton, Typography, Grid, TextField, Divider, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";
import { toast } from 'sonner'
export default function ProfileUpdate({ setProfileUpdateModalOpen, userData }) {
  const [newEmail, setNewEmail] = useState(null);
  const [actualPassword, setActualPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newPassword2, setNewPassword2] = useState(null);
  const token = useSelector((state) => state.store.token);

  async function handleMailSubmit() {
    try {
      const response = await fetch(`${process.env.REACT_APP_URI}/user/update_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
        body: JSON.stringify({
          newEmail: newEmail,
          previousEmail: userData.email
        })
      });
      if (response.status === 200) {
        toast.success('Email modifiée avec succès', {
          position: 'bottom-center'
        });
      } else {
        toast.error('Erreur lors de la modification', {
          position: 'bottom-center'
        })
      }
    } catch (err) {
      console.log(err);
    }
  };

  async function handlePasswordSubmit() {
    try {
      const response = await fetch(`${process.env.REACT_APP_URI}/user/update_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
        body: JSON.stringify({
          newEmail: newEmail,
          previousEmail: userData.email
        })
      });
      if (response.status === 200) {
        toast.success('Email modifiée avec succès', {
          position: 'bottom-center'
        });
      } if (response.status === 409) {
        toast.error('Le nouvel email ne doit pas être le même que l\'ancien', {
          position: 'bottom-center'
        })
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ width: '80%' }}>
      <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
        <Box style={{ background: 'white', padding: '20px', borderRadius: '5px' }}>
          <div style={{ width: '100%', height: '0', textAlign: 'end' }}>
            <IconButton onClick={() => setProfileUpdateModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <Typography variant="h5" style={{ marginBottom: '1.5rem' }}>Modifier les informations</Typography>
          <form>
            <Typography variant='h6'>Modifier l'email</Typography>
            <TextField style={{ margin: '.5rem 0' }} label="Email actuelle" defaultValue={userData.email} fullWidth />
            <TextField style={{ margin: '.5rem 0' }} label="Nouvel email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} fullWidth />
            <Button
              disabled={!newEmail}
              type="button"
              variant='contained'
              style={{ margin: '0.5rem 0' }}
              fullWidth
              onClick={() => handleMailSubmit()}
            >
              Modifier l'email
            </Button>
            <Divider style={{ margin: '0.5rem' }} />
            <Typography variant='h6'>Modifier le mot de passe</Typography>
            <TextField style={{ margin: '.5rem 0' }} type='password' label="Ancien mot de passe" fullWidth onChange={(e) => setActualPassword(e.target.value)} value={actualPassword} />
            <TextField style={{ margin: '.5rem 0' }} type='password' label="Nouveau mot de passe" fullWidth onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
            <TextField style={{ margin: '.5rem 0' }} type='password' label="Confirmez le nouveau mot de passe" fullWidth onChange={(e) => setNewPassword2(e.target.value)} value={newPassword2} />
            <Button
              disabled={!newPassword || !newPassword2}
              type="button"
              variant='contained'
              style={{ margin: '0.5rem 0' }}
              fullWidth
              onClick={() => handlePasswordSubmit()}
            >
              Modifier le mot de passe
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
