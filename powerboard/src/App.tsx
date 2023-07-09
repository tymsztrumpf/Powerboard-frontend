import React, {useEffect, useState} from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";

import './App.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {AppRouter} from "./router/AppRouter";
import {withAxiosIntercepted} from "./hooks/withAxiosIntercepted";
import {UserContext, UserContextProvider} from "./context/UserContext";
import {BoardContextProvider} from "./context/BoardContext";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";

function App() {

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#0d47a1', // głęboki odcień niebieskiego
            },
            secondary: {
                main: '#9e9e9e', // neutralny, jasny odcień szarości
            },
            background: {
                default: '#121212', // bardzo ciemny szary na tło
                paper: '#1e1e1e', // nieco jaśniejszy szary na elementy 'paper'
            },
            text: {
                primary: '#e0e0e0', // jasny szary na główny tekst
                secondary: '#9e9e9e', // neutralny, jasny szary na drugorzędny tekst
            },
        },
        shape: {
            borderRadius: 6,
        },
        typography: {
            fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
            fontSize: 16,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
            fontWeightBold: 700,
        },
        spacing: 2,
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                    },
                },
            },
        },
    });

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline>
                    <UserContextProvider>
                        <BoardContextProvider>
                            <Header/>
                            <main>
                                <AppRouter/>
                                <ToastContainer/>
                            </main>
                        </BoardContextProvider>
                    </UserContextProvider>
                </CssBaseline>
            </ThemeProvider>
        </>
    );
}

export default withAxiosIntercepted(App);