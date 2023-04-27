import React, {useEffect} from 'react'
import { useQuery, gql } from "@apollo/client";

import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";


import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ImgMediaCard from "./Card";

function Liked() {
      
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
    const likedLocation_refetch = () =>{
        refetch()
    }
    
    useEffect(()=>{
        likedLocation_refetch();
    }, [data])

    if (loading)
        return (
            <>
              <CssBaseline />
              <AppBar position="relative">
                <Toolbar>
                  <Typography variant="h6">
                    <HourglassBottomIcon /> Loading Data .......wait
                  </Typography>
                </Toolbar>
              </AppBar>
            </>
          );

    
    if (error)
        return (
            <>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                <Typography variant="h6">
                    <HourglassBottomIcon /> 404 - Something went wrong with the server
                </Typography>
                </Toolbar>
            </AppBar>
            </>
        );


    return (
        <>
            <CssBaseline />
            <Typography variant="h6" padding={"10px"}>
                Liked Places
            </Typography>

            {data.likedLocations.length === 0 ? <p>No user liked locations</p>: null}

            <div className="cardLayout">
            {data.likedLocations &&
            data.likedLocations.map((location) => (
            <div>
                <ImgMediaCard location={location} />
            </div>
            ))}
        </div>
       </>
    )
}

export default Liked