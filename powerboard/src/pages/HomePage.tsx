import {useCallback, useEffect, useState} from "react";
import {UserApi} from "../api/UserApi";
import {toast} from "react-toastify";
import {ACCESS_TOKEN} from "../constants/constants";
import {Container, CssBaseline} from "@mui/material";

const HomePage = () => {
    const [firstName, setFirstName] = useState('');

    const fetchUser = useCallback(async () => {
        try {
            const response = await UserApi.getUser();
            localStorage.getItem(ACCESS_TOKEN)
            setFirstName(response.data.firstName)
        } catch (error) {
            toast.error("Bład serwera")
        }

    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser])

    return firstName ? (
        <Container>
            <h1>Welcome to Powerboard, {firstName}! </h1>
        </Container>
    ) : (
        <Container>
            <h1>Welcome to the Powerboard! </h1>
        </Container>
    )

}

export default HomePage;