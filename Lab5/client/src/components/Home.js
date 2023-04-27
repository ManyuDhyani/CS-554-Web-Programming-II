import React, {useState} from 'react'
import { useQuery, gql } from "@apollo/client";

import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Button from '@mui/material/Button';


import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ImgMediaCard from "./Card";

function Home() {
    const [pageCounter, setPageCounter] = useState(1);
      
    const GET = gql`
    query ($pageNum: Int) {
        locationPosts(pageNum: $pageNum) {
            id
            name
            image
            address
            userPosted
            liked
        }
    }
    `;
    const { loading, error, data, refetch } = useQuery(GET, {
    variables: { pageNum: pageCounter },
    });

    const handleGetMoreClick = async () => {
        await setPageCounter(pageCounter + 1);
        refetch({
            variables: { pageNum: pageCounter }
        });
    }

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
                Places
            </Typography>
            <Button variant="contained" sx={{ mx: 'auto', width: 200, my: 1}} onClick={handleGetMoreClick} disabled={pageCounter >= 5}>Get More</Button>
            <div className="cardLayout">
            {data.locationPosts &&
            data.locationPosts.map((location) => (
            <div>
                <ImgMediaCard location={location} />
            </div>
            ))}
        </div>
       </>
    )
}

export default Home