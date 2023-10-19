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
  ClickAwayListener,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { toast } from "sonner";

export default function Register({ setIndex, setOpen }) {

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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

    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Veuillez remplir tous les champs.", {
        position: 'bottom-center'
      });
      return;
    };
    // Password confirmation 
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.", {
        position: 'bottom-center'
      }); 
      return;
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
        toast.success('Compte créé avec succès', {
          position: 'bottom-center'
        })
      }
      if (response.status === 400) {
        toast.error("Informations d'identification non valides", {
          position: 'bottom-center'
        })
      }
      if (response.status === 409) {
        toast.error('Addresse mail déjà utilisée', {
          position: 'bottom-center'
        });
      }
    } catch (err) {
      return;
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
      <ClickAwayListener onClickAway={() => setOpen(false)}>
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
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmation du mot de passe"
                  type={showConfirmationPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
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
      </ClickAwayListener>
    </Container>
  );
}
