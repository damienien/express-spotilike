import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Button,
  TextField,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import SvgSmiley from "../../../ressources/img/Spotify_icon.png";
import HomeComponent from "../home";
import config from "../../../config";

const ArtistCreate = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [covers, setCover] = useState("");

  useEffect(() => {
    window.scrollTo(0,0)
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault()
    const storedToken = localStorage.getItem("accessToken");

      fetch(`${config.apiUrl}/api/artists/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedToken}`,
        },

        body: JSON.stringify({
            name: name,
            avatar: covers,
            bio: bio,
        })
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `La requête a échoué avec le statut ${response.status}`
          );
        }
        return response.json();
      })
      .then(() => {
        console.log("Création de l'album réussie !")
        navigate('/artists')
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
              navigate("../", { relative: "path" });
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
            <h2>Add new artist</h2>
            <TextField
              label="Name"
              required
              variant="outlined"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              color="secondary"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
            />
            <TextField
              label="Avatar"
              variant="outlined"
              required
              value={covers}
              onChange={(e) => {
                setCover(e.target.value);
              }}
              color="secondary"
              type="url"
              sx={{ mb: 3 }}
              fullWidth
            />
            <TextField
              label="Bio"
              variant="outlined"
              required
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
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
                sx={{ mb: 2, width: 30 }}
              >
                Create
              </Button>
            </Box>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ArtistCreate;
