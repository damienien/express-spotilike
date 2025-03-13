import React, { useState } from "react";
import { Button, Card, Grid, TextField } from "@mui/material";
import SvgSmiley from "../../ressources/img/Spotify_icon.png";
import { Link, useNavigate } from "react-router-dom";
import config from "../../config";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setEmailError(false);
    setPasswordError(false);
    setError(false);

    if (email === "") {
      setEmailError(true);
    }
    if (password === "") {
      setPasswordError(true);
    }
    if (email !== "" && password !== "") {
      fetch(`${config.apiUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          navigate("/home");
          const token = data['token']
          localStorage.setItem('accessToken', token)
        })
        .catch((error) => {
          console.error(error);
          setError(true);
        });
    }
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
            <img alt="Spotify icon"
              src={SvgSmiley}
              style={{ position: "absolute", width: "4%", left: "1%" }}
            ></img>
            <h1 style={{ flex: 1, textAlign: "center" }}>SPOTILIKE</h1>
          </Card>
        </Grid>
        <Grid item xs={12}>
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
              sx={{ ml: 10, mr: 10 }}
            >
              <h2>Login Form</h2>
              {error && <h2>Bad credential !</h2>}
              <TextField
                label="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                color="secondary"
                value={email}
                error={emailError}
                type="email"
                sx={{ mb: 3 }}
                fullWidth
              />
              <TextField
                label="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                color="secondary"
                type="password"
                value={password}
                error={passwordError}
                sx={{ mb: 3 }}
                fullWidth
              />
              <Button
                variant="outlined"
                color="secondary"
                type="submit"
                sx={{ mb: 2, width: 30 }}
              >
                Login
              </Button>
              <small style={{ display: "flex", marginBottom: "3%" }}>
                Need an account ? <Link to="/register">Register here</Link>
              </small>
            </form>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
