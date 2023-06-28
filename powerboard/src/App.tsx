import React from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import './App.css';

function App() {

    return (
        <><Header/>
            <main>
                <Container>
            <h1>React app is working!</h1>
                </Container>
            </main>
            <Footer/></>
    );
}

export default App;