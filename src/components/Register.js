import { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Avatar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Register({ setIndex }) {

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();

    // Password confirmation 
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas."); // Définissez le message d'erreur
      return; // Arrêtez le traitement du formulaire
    };

    try {
      const response = await fetch('http://localhost:5000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "firstname": formData.firstname,
          "lastname": formData.lastname,
          "email": formData.email,
          "password": formData.password
        })
      });
      if (response.status === 201) {
        setIndex(0);
      }
    } catch(err) {
      console.log(err)
    }

  };

  function toggleShowPassword() {
    setShowPassword(!showPassword);
  };

  function toggleShowPasswordConfirmation() {
    setShowConfirmationPassword(!showConfirmationPassword)
  }

  return (
    <Container component="main" maxWidth="xs" style={{ background: 'white', borderRadius: '5px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
        <Avatar style={{ backgroundColor: 'secondary' }}></Avatar>
        <Typography component="h1" variant="h5" style={{ marginTop: '1rem' }}>
          Création de compte
        </Typography>
        <Typography style={{ fontSize: 'small' }}>
          <Button size='small' style={{ fontSize: 'small', margin: '0.5rem 0 0 0' }} onClick={() => setIndex(0)}>Avez un compte ? Connectez vous</Button>
        </Typography>
        <form style={{ width: '100%', marginTop: '1rem' }} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="firstname"
                label="Prénom"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastname"
                label="Nom"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
              />
            </Grid>
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
                type={showPassword ? "text" : "password"} 
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errorMessage ? "red-text-field" : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                color={errorMessage && 'error'}
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirmation du mot de passe"
                type={showConfirmationPassword ? "text" : "password"} 
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errorMessage ? "red-text-field" : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleShowPasswordConfirmation}
                        edge="end"
                      >
                        {showConfirmationPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          {errorMessage && (
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: '1rem 0 2rem 0' }}
            onClick={(event) => handleSubmit(event)}
          >
            Se connecter
          </Button>

        </form>
      </div>
    </Container>
  );
}
