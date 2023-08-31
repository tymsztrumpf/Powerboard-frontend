import {SyntheticEvent, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {AuthApi} from "../api/AuthApi";
import {Box, Button, Container, CssBaseline, TextField, Typography} from "@mui/material";
import {StyledContainer, ValidationError} from "./SignupPage.style";

const SignupPage = () => {

    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
    const [isDataValid, setIsDataValid] = useState<boolean>(false);
    const [isRepeatedPasswordValid, setIsRepeatedPasswordValid] = useState<boolean>(true);
    const [repeatedPassword, setRepeatedPassword] = useState('')
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
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return passwordRegex.test(password);
    }
    const validateRepeatedPassword = (repeatedPassword: string) => {
        return password == repeatedPassword;
    };

    useEffect(() => {
        setIsEmailValid(validateEmail(email));
        setIsPasswordValid(validatePassword(password));
        setIsRepeatedPasswordValid(validateRepeatedPassword(repeatedPassword));
        setIsDataValid((isPasswordValid && isEmailValid && isRepeatedPasswordValid))
    }, [email, password, repeatedPassword, isPasswordValid, isEmailValid, isRepeatedPasswordValid]);

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
                    {!isEmailValid && email.length !== 0 && <ValidationError>This is not a valid email</ValidationError>}
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
                    {!isPasswordValid && password.length !== 0 && <ValidationError>Password must be at least 8 characters long and contain one digit, one lowercase letter, and one uppercase letter</ValidationError>}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="repeatedPassword"
                        label="Repeat password"
                        type="password"
                        id="repeatedPassword"
                        autoComplete="current-password"
                        value={repeatedPassword}
                        onChange={e=>setRepeatedPassword(e.target.value)}
                    />
                    {!isRepeatedPasswordValid && password.length !== 0 && <ValidationError>Passwords do not match</ValidationError>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={!isDataValid}
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