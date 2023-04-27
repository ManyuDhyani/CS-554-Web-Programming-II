import React from 'react';
import './App.css';

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { useQuery, gql } from "@apollo/client";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import Home from './components/Home';
import Liked from './components/Liked';
import UserLocation from './components/UserLocation';
import NewLocation from './components/NewLocation';
import NotFound from "./components/NotFound";

function App() {
  
  const GET = gql`
    query {
      likedLocations {
        id
        name
        image
        address
        userPosted
        liked
      }
    }
  `;
  const { loading, error, data, refetch } = useQuery(GET);
  const handleLikeRefetch = () => {
    refetch();
  };

  return (
    <Router>
      <div className="App">
        <Grid container spacing={2} justifyContent={"center"} padding={"10px"}>
          <Grid item>
            <Link to="/">
              <Button variant="outlined" color="primary" >Home</Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/my-likes" onClick={handleLikeRefetch}>
              <Button variant="outlined" color="primary">Liked Locations</Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/my-locations">
              <Button variant="outlined" color="primary">User Location</Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to="/new-location">
              <Button variant="outlined" color="primary">New Location Form</Button>
            </Link>
          </Grid>
        </Grid>
        
        <>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/my-likes" element={<Liked />} />
            <Route exact path="/my-locations" element={<UserLocation />} />
            <Route exact path="/new-location" element={<NewLocation />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </>
    </div>
    </Router>
  );
}

export default App;
