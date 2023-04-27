import React, { useState, useEffect } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Link from '@mui/material/Link';

import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import LinkIcon from '@mui/icons-material/Link';



import { useParams } from "react-router-dom";

const AttractionDetail = (props) => {
  const [details, setDetails] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  let { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/attractions/${id}.json?apikey=IWGlPY8O4dZ77LliNtcfwoMMbFg7GRn9`
          );
        setDetails(data);
        setLoading(false);
        setIsError(false);
      } catch (e) {
        console.log(e)
        setIsError(true);
      }
    }
    fetchData();
  }, [id]);

  if (isError)
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6">
            <HourglassBottomIcon /> 404 - Page Not Found
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
  
  if (loading) {
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
  } else {
    return (
        <>
          <CssBaseline />
          <Typography variant="h6" padding={"10px"}>
            Attraction Details: {details.name}
          </Typography>
          <Container style={{paddingTop: "10px", paddingBottom: "10px" }}>
            {details.externalLinks && details.externalLinks.youtube ? <Link href={details.externalLinks?.youtube[0]?.url} target="_blank"><YouTubeIcon /></Link> : null}
            {details.externalLinks && details.externalLinks.twitter ? <Link href={details.externalLinks?.twitter[0]?.url} target="_blank"><TwitterIcon /></Link> : null}
            {details.externalLinks && details.externalLinks.itunes ? <Link href={details.externalLinks?.itunes[0]?.url} target="_blank"><AppleIcon /></Link> : null}
            {details.externalLinks && details.externalLinks.facebook ? <Link href={details.externalLinks?.facebook[0]?.url} target="_blank"><FacebookIcon /></Link> : null}
            {details.externalLinks && details.externalLinks.instagram ? <Link href={details.externalLinks?.instagram[0]?.url} target="_blank"><InstagramIcon /></Link> : null}
            {details.externalLinks && details.externalLinks.homepage ? <Link href={details.externalLinks?.homepage[0]?.url} target="_blank"><LinkIcon /></Link> : null}
        </Container>
          <>
            <Card sx={{ maxWidth: 345 }} style={{ margin: "auto"}}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="450"
                image={details.images[0].url}
              />
            </Card>
          </>
      </>
    );
  }
};

export default AttractionDetail;
