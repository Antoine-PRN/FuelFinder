import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Grid,
  Container,
  Box,
  IconButton,
  Button,
  Modal,
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import { googleLogout } from "@react-oauth/google";
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner'
import ProfileUpdate from "./ProfileUpdate";
import CloseIcon from '@mui/icons-material/Close';

export default function ProfileData({ setOpen, setIndex }) {
  const [userData, setUserData] = useState({});
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileUpdateModalOpen, setProfileUpdateModalOpen] = useState(false);

  const token = useSelector((state) => state.store.token);
  const googleAuth = useSelector((state) => state.store.profile);
  const no_ads = useSelector((state) => state.store.no_ads);

  const dispatch = useDispatch()

  useEffect(() => {
    fetch(`${process.env.REACT_APP_URI}/config`)
      .then(response => response.json())
      .then(data => {
        const publishableKey = data.publishableKey;
        setStripePromise(loadStripe(publishableKey));
      })
      .catch(error => {
        console.error('Error fetching publishable key:', error);
      });
  }, [modalOpen]);


  useEffect(() => {
    fetch(`${process.env.REACT_APP_URI}/create-payment-intent`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then(data => {
        const client_secret = data.clientSecret;
        setClientSecret(client_secret);
      })
  }, [stripePromise]);


  const logOut = () => {
    googleLogout();
    dispatch({
      type: 'SET_PROFILE',
      profile: null
    });
    dispatch({
      type: 'SET_AUTHENTICATED',
      payload: null
    });
    dispatch({
      type: 'SET_NO_ADS',
      no_ads: null
    })
    setIndex(0);
    toast.success('Déconnection réussie', {
      position: 'bottom-center'
    })
  };

  function handleLogout(event) {
    event.preventDefault();
    dispatch({
      type: 'SET_AUTHENTICATED',
      payload: null
    })
    dispatch({
      type: 'SET_NO_ADS',
      no_ads: null
    })
    setIndex(0)
    toast.success('Déconnection réussie', {
      position: 'bottom-center'
    })
  }

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("http://localhost:5000/rest/user/get_user", {
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
    <>
      <Container component="main" maxWidth="xs" style={{ background: 'white', borderRadius: '5px', padding: '1rem' }}>
        <div style={{ width: '100%', height: '0', textAlign: 'end' }}>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </div>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h4">
              {userData.firstname} {userData.lastname}
            </Typography>
          </Grid>
          <Grid item>
            <Typography style={{ margin: '0.5rem 0' }}>
              Adresse mail: {userData.email}
            </Typography>

          </Grid>
          <Grid item>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">
                Compte créé le: {userData.account_creation}
              </Typography>
              <IconButton onClick={() => setProfileUpdateModalOpen(true)}>
                <SettingsIcon size='small' />
              </IconButton>
            </Box>
          </Grid>
          {no_ads === undefined && (
            <Grid item>
              <button className="button" onClick={() => stripePromise && clientSecret && setModalOpen(true)} style={{ display: 'flex', alignItems: 'center' }}>
                Supprimer les pubs 3.99€
              </button>
            </Grid>
          )}
        </Grid>

        {googleAuth ? (
          <Button
            fullWidth
            variant="contained"
            color="error"
            style={{ margin: '3rem 0 .5rem 0' }}
            onClick={() => logOut()}
          >
            Se déconnecter de Google
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="error"
            style={{ margin: '3rem 0 .5rem 0' }}
            onClick={(event) => { handleLogout(event); toast.success('Déconnection réussie', { position: 'bottom-center' }) }}
          >
            Se déconnecter
          </Button>
        )}

      </Container>

      <Modal open={profileUpdateModalOpen} onClose={() => setProfileUpdateModalOpen(false)}>
        <Box style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ProfileUpdate setProfileUpdateModalOpen={setProfileUpdateModalOpen} userData={userData} />
        </Box>
      </Modal>
    </>
  );
}
