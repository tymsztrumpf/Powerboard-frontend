import {SyntheticEvent, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {AuthApi} from "../api/AuthApi";
import {ACCESS_TOKEN} from "../constants/constants";
import {UserContext} from "../context/UserContext";
import {Box, Button, Container, CssBaseline, TextField, Typography} from "@mui/material";
import {StyledContainer} from "./LoginPage.style";
const LoginPage = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const context = useContext(UserContext)
    const submitHandler = async (e: SyntheticEvent) => {
        e.preventDefault()
        try {
            const response = await AuthApi.signIn({
                email: email,
                password: password
            })
            const user = {email: email, firstName: "pawel"};

            localStorage.setItem(ACCESS_TOKEN, response.data.token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            context.currentUserModifier(user);

            toast.success("Logged in");
            navigate('/');
        }
        catch (error) {
            toast.error("Invalid password or username")
        }
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
                    Login
                </Typography>
                <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>

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
                        label="Hasło"
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
                        Zaloguj
                    </Button>
                </Box>
            </Box>
            </StyledContainer>
        </Container>
    );
}
export default LoginPage;