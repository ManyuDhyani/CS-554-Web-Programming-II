import React from "react";
import "./App.css";
import Event from "./components/Event";
import { Routes, Route, Link } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Detail from "./components/Detail";
import Venues from "./components/Venues";
import VenueDetail from "./components/VenueDetail"
import Attraction from './components/Attraction'
import AttractionDetail from './components/AttractionsDetail'
import NotFound from "./components/NotFound";
import Home from "./components/Home"

const App = () => {
  return (
    <div className="App">
      <header>
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            align="center"
            color="textPrimary"
            fontWeight={600}
            gutterBottom
          >
            Ticket Legends
          </Typography>
        </Container>
        <Grid container spacing={2} justifyContent={"center"} padding={"10px"}>
          <Grid item>
            <Link to="/">
              <Button variant="outlined" color="primary" >Home</Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/events/page/1">
              <Button variant="outlined" color="primary" >Events</Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/attractions/page/1">
              <Button variant="outlined" color="primary" >Attraction</Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/venues/page/1">
              <Button variant="outlined" color="primary" >Venue</Button>
            </Link>
          </Grid>
        </Grid>
      </header>
      <main className="App-body">
        <>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/events/:id" element={<Detail />} />
            <Route exact path="/events/page/:page" element={<Event />} />
            <Route exact path="/attractions/:id" element={<AttractionDetail />} />
            <Route exact path='/attractions/page/:page' element={<Attraction />} />
            <Route exact path="/venues/:id" element={<VenueDetail />} />
            <Route exact path='/venues/page/:page' element={<Venues />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </>
      </main>
    </div>
  );
};

export default App;
