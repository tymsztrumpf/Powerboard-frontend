import React, {useEffect, useState} from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import './App.css';
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SingupPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {AppRouter} from "./router/AppRouter";

function App() {

    return (
        <Router>
            <Header/>
            <main>
                <Container>
                    <AppRouter />
                    <ToastContainer />
                </Container>
            </main>
            <Footer/>
        </Router>
    );
}

export default App;