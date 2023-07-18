import React, {useContext, useEffect, useState} from 'react';
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
import ThemeSwitcher from "./components/ThemeSwitcher";
import {ThemeContext, ThemeContextProvider} from "./context/ThemeContext";

function App() {

    return (
        <>
            <ThemeContextProvider>
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
            </ThemeContextProvider>
        </>
    );
}

export default withAxiosIntercepted(App);