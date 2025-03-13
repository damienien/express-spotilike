import { Grid, Card, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import SvgSmiley from "../../ressources/img/Spotify_icon.png"
import { useNavigate } from "react-router-dom";
import config from "../../config";


const Register = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setEmailError(false)
        setPasswordError(false)
        setUsernameError(false)

        if(email === ''){
            setEmailError(true)
        }
        if (password === ''){
            setPasswordError(true)
        }
        if (username === ''){
            setUsernameError(true)
        }
        if(email !== '' && password !== '' && username !== ''){
            fetch(`${config.apiUrl}/api/user/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                navigate('/')})
            .catch(error => {
                console.error(error)})
        }
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card sx={{
                    width: '80%',
                    position: 'relative',
                    transform: 'translate(12%, 10%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <img alt="smiley" src={SvgSmiley} style={{ position: 'absolute', width: '4%', left: '1%' }}></img>
                    <h1 style={{ flex: 1, textAlign: 'center' }}>SPOTILIKE</h1>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card sx={{ justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            border: 'solid black 1px',
                            marginRight: '20%',
                            marginLeft: '20%',
                            marginTop: '2%'}}>
                    <form autoComplete="off" onSubmit={handleSubmit} sx={{ ml: 10, mr: 10}}>
                        <h2>Register Form</h2>
                        <TextField 
                        label="username"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        color="secondary"
                        value={username}
                        error={usernameError}
                        type="username"
                        sx={{mb: 3}}
                        fullWidth />
                        <TextField
                        label="Email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        color="secondary"
                        value={email}
                        error={emailError}
                        type="email"
                        sx={{ mb: 3}}
                        fullWidth />
                        <TextField 
                        label="Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        color="secondary"
                        type="password"
                        value={password}
                        error={passwordError}
                        sx={{mb: 3}}
                        fullWidth />
                        <Button variant="outlined" color="secondary" type="submit" sx={{mb: 2, width: "20%"}}>Register</Button>
                    </form>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Register