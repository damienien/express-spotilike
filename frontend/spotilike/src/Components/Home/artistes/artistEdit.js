import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Button,
  TextField,
  Box,
  CardMedia,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import SvgSmiley from "../../../ressources/img/Spotify_icon.png";
import HomeComponent from "../home";
import config from "../../../config";


const ArtisteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState({});
  const [bio, setBio] = useState("");
  const [titles, setTitle] = useState("");
  const [covers, setCover] = useState("");
  const [isEdited, setIsEdited] = useState(false);

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
    window.scrollTo(0,0)
  }, []);

  useEffect(() => {
    if (Object.keys(artist).length > 0) {
      setTitle(artist["name"]);
      setCover(artist["avatar"]);
      setBio(artist["bio"])
      console.log(artist)
    }
  }, [artist]);

  const handleDelete = () => {
    const storedToken = localStorage.getItem("accessToken");
    fetch(`${config.apiUrl}/api/artists/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `La requête a échoué avec le statut ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Suppression réussie:", data);
        navigate("../..", { relative: "path" });
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression:", error.message);
      });
  };

  const handleSubmit = (e) => {
    const storedToken = localStorage.getItem("accessToken");

    fetch(`${config.apiUrl}/api/artists/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        name: titles !== "" ? titles : artist["name"],
        avatar: covers !== "" ? covers : artist["avatar"],
        bio: bio !== "" ? bio : artist["bio"],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `La requête a échoué avec le statut ${response.status}`
          );
        }
        return response.json();
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
      <Grid item xs={12}>
        <Box sx={{ position: "absolute", left: "3%", mt: "5%" }}>
          <Button
            onClick={() => {
              navigate("../..", { relative: "path" });
            }}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            color="warning"
          >
            Back
          </Button>
        </Box>
        <Card
          sx={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            border: "solid black 1px",
            marginRight: "20%",
            marginLeft: "20%",
            marginTop: "2%",
          }}
        >
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            style={{ marginLeft: 10, marginRight: 10 }}
          >
            <h2>Edit Form</h2>
            <TextField
              label="name"
              variant="outlined"
              value={titles}
              onChange={(e) => {
                setTitle(e.target.value);
                if(e.target.value !== ''){
                  setIsEdited(true)
                } else {
                  setIsEdited(false)
                }
              }}
              color="secondary"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
            />
            <TextField
              label="Avatar"
              variant="outlined"
              value={covers}
              onChange={(e) => {
                setCover(e.target.value);
                if(e.target.value !== ''){
                  setIsEdited(true)
                } else {
                  setIsEdited(false)
                }
              }}
              color="secondary"
              type="url"
              sx={{ mb: 3 }}
              fullWidth
            />
            <TextField
              label="Bio"
              variant="outlined"
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                if(e.target.value !== ''){
                  setIsEdited(true)
                } else {
                  setIsEdited(false)
                }
              }}
              color="secondary"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                type="submit"
                disabled={!isEdited}
                sx={{ mb: 2, width: 30 }}
              >
                Modify
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ mb: 2, width: 30 }}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </form>
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
        <Typography variant="h4" component="div" gutterBottom>
          Overview of changes
        </Typography>
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
    </Grid>
  );
};

export default ArtisteEdit;
