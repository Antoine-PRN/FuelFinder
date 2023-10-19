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
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner'

export default function Login({ setIndex, setOpen }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs', {
        position: 'bottom-left'
      });
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_URI}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          stayLoggedIn,
        }),
      });
      const data = await response.json();

      if (response.status === 200) {
        dispatch({
          type: 'SET_AUTHENTICATED',
          payload: data.token,
        });
        dispatch({
          type: 'SET_PREMIUM',
          premium: data.no_ads
        })
        if (stayLoggedIn) {
          dispatch({
            type: 'SET_REFRESH_TOKEN',
            refresh_token: data.refreshToken,
          });
        }

        setOpen(false);
        toast.success('Connection reussie', {
          position: 'bottom-left'
        });
        return data;
      }
      if (response.status === 404) {
        toast.error('Erreur lors de la connection', {
          position: 'bottom-left',
        })
      }
    } catch (err) {
      toast.error('Ereur de connection au serveur')
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      toast.success('Connection réussie', {
        position: 'bottom-left'
      })
    },
    onError: () => toast.error('Erreur de connection', {
      position: 'bottom-left'
    })
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.access_token) {
          // Effectuez la première requête pour récupérer les informations de l'utilisateur
          const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json',
            },
          });

          if (userInfoResponse.status === 200) {
            const userData = await userInfoResponse.json();

            // Effectuez la deuxième requête pour enregistrer les informations de l'utilisateur sur le backend
            const response = await fetch(`${process.env.REACT_APP_URI}/google/register`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user: userData
              })
            });

            const data = await response.json()

            if (response.status === 201) {
              dispatch({
                type: 'SET_USER',
                user: user
              });
              dispatch({
                type: 'SET_PROFILE',
                profile: userData
              });
              dispatch({
                type: 'SET_AUTHENTICATED',
                payload: data.token
              })
              setOpen(false);
              setIndex(2)
            } else {
              console.error('Failed to register user');
            }
          } else {
            console.error('Failed to fetch user info');
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user, setOpen, dispatch, setIndex]);


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
                  value={email}
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
                  value={password}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: '1rem 0 0 0' }}
                onClick={(event) => handleSubmit(event)}
              >
                Se connecter
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                style={{ margin: '1rem 0' }}
                onClick={() => login()}
              >
                Connexion avec Google
              </Button>
            </Grid>
            <Typography variant="caption" style={{ margin: '0 0 1rem 0' }}>
              * Vous resterez connecté pendant 30 jours
            </Typography>
          </form>
        </div>
      </ClickAwayListener>
    </Container>
  );
}
