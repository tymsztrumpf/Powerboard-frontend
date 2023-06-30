import React, {useEffect, useState} from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import './App.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {AppRouter} from "./router/AppRouter";
import {withAxiosIntercepted} from "./hooks/withAxiosIntercepted";

function App() {

    return (
        <>
            <Header/>
            <main>
                <Container>
                    <AppRouter />
                    <ToastContainer />
                </Container>
            </main>
            <Footer/>
      </>
    );
}

export default withAxiosIntercepted(App);