import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import SvgSmiley from "../../../ressources/img/Spotify_icon.png";
import HomeComponent from "../home";
import { useNavigate, Link } from "react-router-dom";
import config from "../../../config";

const Artistes = () => {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  const getArtists = () => {
    fetch(`${config.apiUrl}/api/artists`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // "data" contient les albums récupérés depuis la route /albums
        setArtists(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des albums:", error);
      });
  }

  useEffect(() => {
    getArtists()
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if(artists.length > 0){
        console.log(artists)
    }
  }, [artists])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} width={"100%"}>
        <Card
          sx={{
            width: "80%",
            transform: "translate(12%, 10%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "fixed",
            zIndex: "1",
          }}
        >
          <img alt="smiley"
            src={SvgSmiley}
            style={{ position: "absolute", width: "4%", left: "1%" }}
          ></img>
          <h1 style={{ flex: 1, textAlign: "center" }}>
            <Link to="/home" style={{ textDecoration: "none", color: "black" }}>
              SPOTILIKE
            </Link>
          </h1>

          <HomeComponent />
        </Card>
      </Grid>
      <Grid
        container
        ml={5}
        mt={4}
        sx={{ position: "relative", marginTop: "9%" }}
      >
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("create")}
          >
            Add artist
          </Button>
        </Grid>
        {artists.length > 0 &&
          artists.map((el) => (
            <Grid key={`g-${el["_id"]}`} item xs={4}>
              <Card
                key={`c-${el["_id"]}`}
                sx={{ maxWidth: "80%", mb: 4, mt: 4 }}
              >
                <CardMedia
                  key={el["_id"]}
                  component="img"
                  height="360"
                  src={el["avatar"]}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h5" gutterBottom component="div">
                    {el["name"]}
                  </Typography>
                  <Typography variant="body2" gutterBottom component="div">
                    {el["bio"]}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/artists/${el["_id"]}`)}
                  >
                    Details
                  </Button>
                  <Button
                    onClick={() => navigate(`/artists/edit/${el["_id"]}`)}
                    size="small"
                    variant="contained"
                    color="secondary"
                  >
                    Modify
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
};

export default Artistes;
