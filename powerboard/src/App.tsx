import React, {useEffect, useState} from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import './App.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {AppRouter} from "./router/AppRouter";
import {withAxiosIntercepted} from "./hooks/withAxiosIntercepted";
import {UserContext, UserContextProvider} from "./context/UserContext";
import {BoardContextProvider} from "./context/BoardContext";

function App() {

    return (
        <UserContextProvider>
            <BoardContextProvider>
            <Header/>
            <main>
                <Container>
                    <AppRouter />
                    <ToastContainer />
                </Container>
            </main>
            <Footer/>
            </BoardContextProvider>
        </UserContextProvider>
    );
}

export default withAxiosIntercepted(App);