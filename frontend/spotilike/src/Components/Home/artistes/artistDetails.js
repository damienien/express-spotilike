import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Button,
  Box,
  CardMedia,
  Typography,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import SvgSmiley from "../../../ressources/img/Spotify_icon.png";
import HomeComponent from "../home";
import config from "../../../config";

const ArtistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState({});
  const [morceaux, setMorceaux] = useState([]);
  const [data, setData] = useState([]);

  const getArtistDetail = () => {
    fetch(`${config.apiUrl}/api/artist/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setArtist(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des albums:", error);
      });
  };

  useEffect(() => {
    getArtistDetail();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (Object.keys(artist).length > 0) {
      fetch(`${config.apiUrl}/api/artists/${id}/songs`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data.forEach((el) => {
            const timeMs = el["length"];
            const totalSeconde = Math.floor(timeMs / 1000);
            const minutes = Math.floor(totalSeconde / 60);
            const secondes = totalSeconde % 60;

            const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
            const secondesStr = secondes < 10 ? `0${secondes}` : `${secondes}`;

            el["length"] = `${minutesStr}:${secondesStr}`;
          });
          setMorceaux(data);
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
    // eslint-disable-next-line
  }, [artist]);

  useEffect(() => {
    if (morceaux.length > 0) {
      const updatedMorceaux = [...morceaux]; // Créez une copie de morceaux

      // Effectuez les modifications sur la copie de morceaux
      Promise.all(
        updatedMorceaux.map(async (morceau) => {
          const response = await fetch(
            `${config.apiUrl}/api/albums/${morceau["album"]}`
          );
          const datas = await response.json();
          morceau["album"] = datas[0]["title"];
          morceau["artiste"] = datas[0]["cover"];
        })
      )
        .then(() => {
          // Une fois que toutes les mises à jour sont terminées, mettez à jour l'état `data`
          setData(updatedMorceaux);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [morceaux]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} width={"100%"}>
        <Card
          sx={{
            width: "80%",
            position: "relative",
            transform: "translate(12%, 10%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img alt="spotify"
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
        mt={4}
        sx={{
          alignContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ position: "absolute", left: "3%", mt: "5%" }}>
          <Button
            onClick={() => {
              navigate("../", { relative: "path" });
            }}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            color="warning"
          >
            Back
          </Button>
        </Box>
        <Card variant="elevation">
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <CardMedia src={artist["avatar"]} component="img" height="360" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 5,
            }}
          >
            <Typography variant="h4" gutterBottom component="div">
              {artist["name"]}
            </Typography>
            <Typography variant="h5" gutterBottom component="div">
              {artist["bio"]}
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Typography variant="h2" component="div" gutterBottom ml={5}>
        Tracks list :
      </Typography>
      <Grid container ml={5} mt={4}>
        {data.length > 0 ? (
          data.map((el, index) => (
            <Grid key={`g-${el["_id"]}`} item xs={4}>
              <Card
                key={`c-${el["_id"]}`}
                sx={{ maxWidth: "70%", mb: 4, mt: 4, ml: 3 }}
              >
                <CardMedia
                  key={el["_id"]}
                  component="img"
                  height="240"
                  src={el["artiste"]}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h5" gutterBottom component="div">
                    {el["title"]}
                  </Typography>
                  <Typography variant="body2" gutterBottom component="div">
                    Album: {el["album"]}
                  </Typography>
                  <Typography variant="caption" gutterBottom component="div">
                    Length : {el["length"]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
};

export default ArtistDetail;
