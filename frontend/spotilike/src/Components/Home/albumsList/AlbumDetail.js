import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Box,
  CardMedia,
  Typography,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TypeSpecimenIcon from "@mui/icons-material/TypeSpecimen";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeComponent from "../home";
import SvgSmiley from "../../../ressources/img/Spotify_icon.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import config from "../../../config";

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState({});
  const [morceaux, setMorceaux] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch(`${config.apiUrl}/api/albums/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAlbum(data[0]);
        const formatedDate = data[0]["date"];
        const dateObject = new Date(formatedDate);

        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        const finalDate = dateObject.toLocaleDateString("fr-FR", options);
        setDate(finalDate);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des albums:", error);
      });
  }, [id]);

  useEffect(() => {
    if (Object.keys(album).length > 0) {
      const fetchPromises = [];
      for (const morceau of album["morceaux"]) {
        const fetchPromise = fetch(`${config.apiUrl}/api/songs/` + morceau)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const timeMs = data[0]["length"];
            const totalSeconde = Math.floor(timeMs / 1000);
            const minutes = Math.floor(totalSeconde / 60);
            const secondes = totalSeconde % 60;

            const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
            const secondesStr = secondes < 10 ? `0${secondes}` : `${secondes}`;

            data[0]["length"] = `${minutesStr}:${secondesStr}`;
            return data;
          });
        fetchPromises.push(fetchPromise);
      }
      Promise.all(fetchPromises)
        .then((data) => {
          setMorceaux(data.flat());
          console.log(data.flat());
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [album]);

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
          <img alt="smiley"
            src={SvgSmiley}
            style={{ position: "absolute", width: "4%", left: "1%" }}
          ></img>
          <h1 style={{ flex: 1, textAlign: "center" }}>
            {" "}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Box sx={{ position: "absolute", left: "3%" }}>
            <Button
              onClick={() => {
                navigate("..", { relative: "path" });
              }}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="warning"
            >
              Back
            </Button>
          </Box>
          <Box>
            <CardMedia src={album["cover"]} component="img" height="360" />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom component="div">
            {album["title"]}
          </Typography>
          <Typography variant="h5" gutterBottom component="div">
            {album["artistes"]}
          </Typography>
          <Typography variant="body2" gutterBottom component="div">
            Released date : {date}
          </Typography>
        </Box>
      </Grid>
      <Typography variant="h2" component="div" gutterBottom ml={5}>
        Tracks list :
      </Typography>
      <Grid container ml={5} mt={4}>
        {morceaux.length > 0 &&
          morceaux.map((el) => (
            <Grid key={`g-${el["_id"]}`} item xs={4}>
              <Card
                key={`c-${el["_id"]}`}
                sx={{ maxWidth: "70%", mb: 4, mt: 4, ml: 3 }}
              >
                <CardMedia
                  key={el["_id"]}
                  component="img"
                  height="240"
                  src={album["cover"]}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h5" gutterBottom component="div">
                    {el["title"]}
                  </Typography>
                  <Typography variant="body2" gutterBottom component="div">
                    {el["artiste"]}
                  </Typography>
                </CardContent>
                <CardContent
                  sx={{ display: "flex", justifyContent: "space-around" }}
                >
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={el["length"]}
                    color="info"
                    variant="outlined"
                  />
                  <Chip
                    icon={<TypeSpecimenIcon />}
                    label={el["genre"]}
                    color="secondary"
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
};

export default AlbumDetail;
