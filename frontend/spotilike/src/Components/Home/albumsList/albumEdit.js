import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Button,
  TextField,
  Box,
  CardMedia,
  Typography,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
import SvgSmiley from "../../../ressources/img/Spotify_icon.png";
import HomeComponent from "../home";
import config from "../../../config";


const AlbumEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState({});
  const [dates, setDate] = useState("");
  const [titles, setTitle] = useState("");
  const [morceaux, setMorceaux] = useState([]);
  const [covers, setCover] = useState("");
  const [LDate, setLDate] = useState("");
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isEdited, setIsEdited] = useState(false);

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

  const getAlbumDetails = () => {
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
        setLDate(finalDate);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des albums:", error);
      });
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

  useEffect(() => {
    getAlbumDetails();
    getSongs();
    window.scrollTo(0,0)
  }, []);

  useEffect(() => {
    if (Object.keys(album).length > 0) {
      setTitle(album["title"]);
      setCover(album["cover"]);
    }
  }, [album]);

  useEffect(() => {
    if (songs.length > 0 && Object.keys(album).length > 0) {
      const idAlbumSong = album["morceaux"];
      const filteredSong = songs.filter(
        (song) => !idAlbumSong.includes(song["_id"])
      );
      setFilteredSongs(filteredSong);
    }
  }, [songs, album]);

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

  const handleDeleteSong = (idSong) => {
    const storedToken = localStorage.getItem("accessToken");
    fetch(`${config.apiUrl}/api/albums/songs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        _id: idSong,
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
      .then(() => {
        console.log("Suppression réussie:");
        navigate(0);
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression:", error.message);
      });
  };

  const handleDelete = () => {
    const storedToken = localStorage.getItem("accessToken");
    fetch(`${config.apiUrl}/api/albums/${id}`, {
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
    let finalSongs = [];
    if (selectedSongs.length > 0) {
      const tempSongs = filteredSongs.filter((song) =>
        selectedSongs.includes(song["title"])
      );
      tempSongs.forEach((song) => {
        finalSongs.push(song["_id"]);
      });
    }

    fetch(`${config.apiUrl}/api/albums/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        title: titles !== "" ? titles : album["title"],
        cover: covers !== "" ? covers : album["covers"],
        date: dates !== "" ? dates : album["date"],
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

    if (finalSongs.length > 0) {
      fetch(`${config.apiUrl}/api/albums/songs/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          morceaux: finalSongs.length > 0 && finalSongs,
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
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if(value.length > 0){
      setIsEdited(true)
    }
    setSelectedSongs(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
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
              label="Title"
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
              label="Cover"
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
              label="Date"
              variant="outlined"
              value={dates}
              onChange={(e) => {
                setDate(e.target.value);
                if(e.target.value !== ''){
                  setIsEdited(true)
                } else {
                  setIsEdited(false)
                }
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
              {filteredSongs.length > 0 &&
                filteredSongs.map((song) => (
                  <MenuItem key={song["_id"]} value={song["title"]}>
                    {song["title"]}
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
            <CardMedia src={album["cover"]} component="img" height="360" />
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
              {album["title"]}
            </Typography>
            <Typography variant="h5" gutterBottom component="div">
              {album["artistes"]}
            </Typography>
            <Typography variant="body2" gutterBottom component="div">
              Released date : {LDate}
            </Typography>
          </Box>
        </Card>
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
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mb: 2, width: 30 }}
                    onClick={() => handleDeleteSong(el["_id"])}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
};

export default AlbumEdit;
