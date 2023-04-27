import React from 'react';
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

const Home = () => {
  return (
    <>
        <CssBaseline />
        <Container>
            <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph
            >
                Welcome to our website! We use Ticketmaster API to bring you the latest and greatest events, attractions, and venues near you. With our user-friendly interface, you can easily browse through a variety of categories and filter your search based on your preferences. Whether you're looking for a music concert, sports game, theater performance, or comedy show, we've got you covered. Our website provides detailed information about each event, including the date, time, location, and ticket prices. So, what are you waiting for? Start exploring and find your next unforgettable experience today!
            </Typography>
        </Container>
    </>
  );
};

export default Home;