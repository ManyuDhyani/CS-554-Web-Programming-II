import React, { useState, useEffect } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";

import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PublicIcon from '@mui/icons-material/Public';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { useParams } from "react-router-dom";

const Detail = (props) => {
  const [details, setDetails] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  let { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=IWGlPY8O4dZ77LliNtcfwoMMbFg7GRn9`
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
          Events Details: {details.name}
        </Typography>
        <>
          <Card sx={{ maxWidth: 345 }} style={{ margin: "auto" }}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="450"
              image={details.images[0].url}
            />
          </Card>
          <Container maxWidth="md">
            {details.dates.timezone ? 
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <PublicIcon /> Timezone :{" "}
              <Typography variant="body1"> {details.dates.timezone}</Typography>
            </Typography> : null
            }
            {details.dates.start.localDate ? <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <CalendarMonthIcon />Date :{" "}
              <Typography variant="body1">
                {" "}
                {details.dates.start.localDate}
              </Typography>
            </Typography>: null
            }
            {details.dates.start.localTime ? <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <ScheduleIcon/> Time :{" "}
              <Typography variant="body1">
                {" "}
                {details.dates.start.localTime}
              </Typography>
            </Typography>: null
            }
            {details.priceRanges ? <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <AttachMoneyIcon />Minimum Price:{" "}
              <Typography variant="body1">
                {" "}
                {details.priceRanges[0].min}
              </Typography>
            </Typography>: null
            }
            {details.priceRanges ? <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <AttachMoneyIcon />Max Price:{" "}
              <Typography variant="body1">
                {" "}
                {details.priceRanges[0].max}
              </Typography>
            </Typography>: null
            }
            <Typography variant="h6">Description :</Typography>
            <Typography variant="body2">{details.info || "N/A"}</Typography>
            <Typography variant="h6">Please Note :</Typography>
            <Typography variant="body2">{details.pleaseNote || "N/A"}</Typography>
          </Container>
        </>
      </>
    );
  }
};

export default Detail;
