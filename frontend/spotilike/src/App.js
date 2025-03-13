import Card from '@mui/material/Card'
import React from 'react'
import './App.css';
import HomeComponent from './Components/Home/home';
import SvgSmiley from "./ressources/img/Spotify_icon.png"
import { Button, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function App() {
  const navigate = useNavigate()

  return (
    <>
    <Grid container spacing={2}>
      <Grid item xs={12} width={"100%"}>
      <Card sx={{
        width: '80%',
        position: 'relative',
        transform: 'translate(12%, 10%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <img alt='smiley' src={SvgSmiley} style={{ position: 'absolute', width: '4%', left: '1%'}}></img>
        <h1 style={{ flex: 1, textAlign: 'center'}}>SPOTILIKE</h1>
        <HomeComponent />
      </Card>
      </Grid>
      <Grid container spacing={3} width={'80%'} sx={{
        position: 'relative',
        transform: 'translate(12%, 10%)',
        display: 'flex',
        mt: 10
      }}>
        <Grid item xs={6}>
          <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '50%',
            transform: 'translate(50%)'
          }}
          variant='outlined'>
            <CardContent>
              <Typography variant='h5' component="div" mt={2} gutterBottom>
                Albums
              </Typography>
            </CardContent>
            <CardContent>
              <Button variant='contained' onClick={() => navigate('/albums')}>
                Select
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '50%',
            transform: 'translate(50%)'
          }}
          variant='outlined'> 
          <CardContent>
              <Typography variant='h5' component="div" mt={2} gutterBottom>
                Artists
              </Typography>
            </CardContent>
            <CardContent>
              <Button variant='contained' onClick={() => navigate('/artists')}>
                Select
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
    </>
  );
}

export default App;
