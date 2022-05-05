import React from "react";
import Navbar from "./Navbar";
// import { Switch, Route } from "react-router-dom";
import Landing from "./Landing";
import About from "./About";
import Features from "./Features";
import { Container } from "@mui/material";
import Footer from "./Footer";
import GetStarted from "./GetStarted";

function Home() {
    return (
        <>
            <Navbar />
            <Container>
                <Landing />
                <GetStarted />
                <Features />
                <About />
            </Container>
            <Footer />
        </>
    );
}

export default Home;
