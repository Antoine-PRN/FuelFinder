import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Grid,
  Container,
  ClickAwayListener,
  Divider,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import { googleLogout } from "@react-oauth/google";

export default function ProfileData({ setOpen, setIndex }) {
  const token = useSelector((state) => state.store.token);
  const googleAuth = useSelector((state) => state.store.profile);
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch()

  const logOut = () => {
    googleLogout();
    dispatch({
      type: 'SET_PROFILE',
      profile: null
    });
    dispatch({
      type: 'SET_AUTHENTICATED',
      payload: null
    })
  };

  function handleLogout(event) {
    event.preventDefault();
    dispatch({
      type: 'SET_AUTHENTICATED',
      payload: null
    })
    setIndex(0)
  }

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("http://localhost:5000/user/get_user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        const data = await response.json();
        setUserData(data.user[0]);
      } catch (error) {
        console.error(error);
        setOpen(false);
      }
    }

    getUser();
  }, [token, setOpen]);

  return (
    <Container component="main" maxWidth="xs" style={{ background: 'white', borderRadius: '5px', padding: '1rem' }}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h4">
              {userData.firstname} {userData.lastname}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              Compte créé le: {userData.account_creation}
            </Typography>
          </Grid>
          <Grid item>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography style={{ margin: '0.5rem 0' }}>
                Adresse mail: {userData.email}
              </Typography>
              <IconButton>
                <SettingsIcon size='small' />
              </IconButton>
            </Box>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
          <Grid item>
            Plus tard ajouter la possibilité d'ajouter le véhicule ainsi que le carburant préféré options payantes etc
          </Grid>
        </Grid>
      </ClickAwayListener>
      {googleAuth && (
        <Box mt={2} p={2} borderTop={1} borderColor="divider">
          <Button
            fullWidth
            variant="contained"
            color="error"
            style={{ margin: '1rem 0' }}
            onClick={() => logOut()}
          >
            Se déonnecter de Google
          </Button>
        </Box>
      )}
      <Box mt={2} p={2} borderTop={1} borderColor="divider">
        <Button
          fullWidth
          variant="contained"
          color="error"
          style={{ margin: '1rem 0' }}
          onClick={(event) => handleLogout(event)}
        >
          Se déconnecter
        </Button>
      </Box>
    </Container>
  );
}
