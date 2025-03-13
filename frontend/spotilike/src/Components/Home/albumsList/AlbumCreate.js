import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Button,
  TextField,
  Box,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import SvgSmiley from "../../../ressources/img/Spotify_icon.png";
import HomeComponent from "../home";
import config from "../../../config";

const AlbumCreate = () => {
  const navigate = useNavigate();
  const [dates, setDate] = useState("");
  const [titles, setTitle] = useState("");
  const [covers, setCover] = useState("");
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState("")
  const [artist, setArtist] = useState([]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const getSongs = () => {
    fetch(`${config.apiUrl}/api/songs`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSongs(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des morceaux", error);
      });
  };

  const getArtists = () => {
    fetch(`${config.apiUrl}/api/artists`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setArtist(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des morceaux", error);
      });
  };

  useEffect(() => {
    getSongs();
    getArtists();
    window.scrollTo(0,0)
  }, []);

  const handleChangeArtist = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedArtist(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSongs(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const storedToken = localStorage.getItem("accessToken");
    let finalSongs = [];
    let finalArtist = ""
    if (selectedSongs.length > 0) {
      const tempSongs = songs.filter((song) =>
        selectedSongs.includes(song["title"])
      );
      tempSongs.forEach((song) => {
        finalSongs.push(song["_id"]);
      });
      
      artist.forEach((art) => {
        if(art["name"] === selectedArtist[0]){
            finalArtist = art["_id"]
        }
      })

      fetch(`${config.apiUrl}/api/albums/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedToken}`,
        },

        body: JSON.stringify({
            title: titles,
            cover: covers,
            date: dates,
            morceaux: finalSongs,
            artistes: finalArtist
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
        navigate('/albums')
      })
      .catch((error) => {
        console.error(error);
      });
    }
    
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
            <h2>Create Form</h2>
            <TextField
              label="Title"
              required
              variant="outlined"
              value={titles}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              color="secondary"
              type="text"
              sx={{ mb: 3 }}
              fullWidth
            />
            <TextField
              label="Cover"
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
              label="Date"
              variant="outlined"
              required
              value={dates}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              color="secondary"
              type="datetime-local"
              sx={{ mb: 3 }}
              fullWidth
            />
            <InputLabel>Songs</InputLabel>
            <Select
              multiple
              fullWidth
              required
              value={selectedSongs}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Songs" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {songs.length > 0 &&
                songs.map((song) => (
                  <MenuItem key={song["_id"]} value={song["title"]}>
                    {song["title"]}
                  </MenuItem>
                ))}
            </Select>
            <InputLabel>Artists</InputLabel>
            <Select
              fullWidth
              required
              value={selectedArtist}
              onChange={handleChangeArtist}
              input={<OutlinedInput id="select-multiple-chip" label="Songs" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {artist.length > 0 &&
                artist.map((art) => (
                  <MenuItem key={art["_id"]} value={art["name"]}>
                    {art["name"]}
                  </MenuItem>
                ))}
            </Select>
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

export default AlbumCreate;
