import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Avatar,
} from '@mui/material';

export default function Login({ setIndex }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Ajoutez ici la logique de soumission du formulaire, par exemple, l'envoi des données au serveur
    console.log(formData);
  };

  return (
    <Container component="main" maxWidth="xs" style={{ background: 'white', borderRadius: '5px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
        <Avatar style={{ backgroundColor: 'secondary' }}></Avatar>
        <Typography component="h1" variant="h5" style={{ marginTop: '1rem' }}>
          Connexion
        </Typography>
        <Typography style={{ fontSize: 'small' }}>
          <Button size='small' style={{ fontSize: 'small', margin: '0.5rem 0 0 0' }} onClick={() => setIndex(1)}>Vous n'avez pas de compte ? Créez en un</Button>
        </Typography>
        <form style={{ width: '100%', marginTop: '1rem' }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: '1rem 0 2rem 0' }}
          >
            Se connecter
          </Button>
        </form>
      </div>
    </Container>
  );
}
