import {SyntheticEvent, useState} from "react";
import { useNavigate } from "react-router-dom";
import {AuthApi} from "../api/AuthApi";
import {Box, Button, Container, CssBaseline, TextField, Typography} from "@mui/material";
import {StyledContainer} from "./SignupPage.style";

const SignupPage = () => {

    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = async (e: SyntheticEvent) => {
        e.preventDefault()

        await AuthApi.signUp({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        })

        navigate('/login');
    }

    return (
        <Container component="main" maxWidth="xs">
            <StyledContainer>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="firstName"
                        label="First name"
                        type="firstName"
                        id="firstName"
                        value={firstName}
                        onChange={e=>setFirstName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="lastName"
                        label="Last name"
                        type="lastName"
                        id="lastName"
                        value={lastName}
                        onChange={e=>setLastName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={e=>setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>

                </Box>
            </Box>
            </StyledContainer>
        </Container>
    )
}
export default SignupPage;