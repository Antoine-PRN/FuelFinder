import { Box, Button, ClickAwayListener, Container, Grid, Typography } from "@mui/material";
import '../style/premium.css'
import CheckIcon from '@mui/icons-material/Check';

export default function Premium({ setModalOpen, setIndexModal }) {
  return (
    <Container component="main" maxWidth="xs" >
      <ClickAwayListener onClickAway={() => setModalOpen(false)}>
        <Grid container spacing={2} direction="column" style={{ background: 'white', borderRadius: '5px', padding: '1rem' }}>
          <Grid>
            <Typography variant="h4" className="title">
              Premium
            </Typography>
          </Grid>
          <Grid>
            <Box className="prices">
              <Typography variant="h3" className="price-before">4.99€</Typography>
              <Typography variant="h3" className="price-after">2.99€</Typography>
            </Box>
            <Typography variant="h6" className="monthly">Par mois</Typography>
          </Grid>
          <Grid>
            <Box className="features">
              <Typography>
                <CheckIcon size="small" color="success" /> Historique des prix
              </Typography>
              <Typography>
                <CheckIcon size="small" color="success" /> Tri des stations par prix
              </Typography>
            </Box>
          </Grid>
          <Grid>
            <Button
              fullWidth
              variant="contained"
              className='button'
              onClick={() => setIndexModal(1)}
            >
              Démarrer L'abonnement
            </Button>
          </Grid>
        </Grid>
      </ClickAwayListener>
    </Container>
  )
}
