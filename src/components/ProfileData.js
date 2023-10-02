import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Typography,
  Grid,
  Container,
  ClickAwayListener,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';

export default function ProfileData({ setOpen }) {
  const token = useSelector((state) => state.store.token);
  const [userData, setUserData] = useState({});

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

        if (!response.ok) {
          throw new Error(`La requête a échoué avec le code : ${response.status}`);
        }

        const data = await response.json();
        console.log(data.user[0])
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
    </Container>
  );
}
