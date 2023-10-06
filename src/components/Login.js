import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Avatar,
  ClickAwayListener,
  Checkbox,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

export default function Login({ setIndex, setOpen }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  console.log('profile: ', profile)
  console.log('user: ', user)
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": formData.email,
          "password": formData.password,
          "stayLoggedIn": stayLoggedIn
        })
      });
      const data = await response.json();

      if (response.status === 200) {
        dispatch({
          type: 'SET_AUTHENTICATED',
          payload: data.token
        });
        if (stayLoggedIn) {
          dispatch({
            type: 'SET_REFRESH_TOKEN',
            refresh_token: data.refreshToken
          })
        }
        setOpen(false);
        return data;
      }
    } catch (err) {
      console.log(err)
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  useEffect(() => {
    if (user && user.access_token) {
      fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          Accept: 'application/json',
        },
      })
        .then((res) => {
          return res.json(); // Parse the JSON data
        })
        .then((data) => {
          setProfile(data); // Set the profile state with the parsed data
        })
        .catch((err) => console.error(err)); // Handle any errors
    }
  }, [user, setOpen, dispatch]);

  return (
    <Container component="main" maxWidth="xs" style={{ background: 'white', borderRadius: '5px' }}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
          <Avatar style={{ backgroundColor: 'secondary' }}></Avatar>
          <Typography component="h1" variant="h5" style={{ marginTop: '1rem' }}>
            Connexion
          </Typography>
          <Typography style={{ fontSize: 'small' }}>
            <Button size='small' style={{ fontSize: 'small', margin: '0.5rem 0 0 0' }} onClick={() => setIndex(1)}>
              Vous n'avez pas de compte ? Créez en un
            </Button>
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
              <Grid item xs={12}>
                <Checkbox
                  checked={stayLoggedIn}
                  onChange={() => setStayLoggedIn(!stayLoggedIn)}
                />
                Rester connecté ?
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {profile && profile.name ? (
                <div>
                  <Typography variant="caption">Bonjour {profile.name} !</Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      style={{ margin: '1rem 0' }}
                      onClick={() => logOut()}
                    >
                      Se déonnecter de Google
                    </Button>
                </div>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ margin: '1rem 0' }}
                  onClick={() => login()}
                >
                  Connexion avec Google
                </Button>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ margin: '1rem 0' }}
              onClick={(event) => handleSubmit(event)}
            >
              Se connecter
            </Button>
            <Typography variant="caption" style={{ margin: '0 0 1rem 0' }}>
              * Vous resterez connecté pendant 30 jours
            </Typography>
          </form>
        </div>
      </ClickAwayListener>
    </Container>
  );
}
