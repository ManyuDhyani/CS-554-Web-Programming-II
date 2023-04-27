import React, { useState, useEffect } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";

import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ExploreIcon from '@mui/icons-material/Explore';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import PlaceIcon from '@mui/icons-material/Place';
import FlagIcon from '@mui/icons-material/Flag';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationCityIcon from '@mui/icons-material/LocationCity';

import { useParams } from "react-router-dom";

const VenueDetail = (props) => {
  const [details, setDetails] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  let { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/venues/${id}.json?apikey=IWGlPY8O4dZ77LliNtcfwoMMbFg7GRn9`
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
          Venue Details: {details.name}
        </Typography>
        <>
          <Container maxWidth="md">
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <ScheduleIcon />{" "}Timezone:{" "}
              <Typography variant="body1"> {details.timezone}</Typography>
            </Typography>
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <PlaceIcon />{" "}Address:{" "}
              <Typography variant="body1">
                {" "}
                {details.address.line1}
              </Typography>
            </Typography>
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <LocationCityIcon />{" "}City:{" "}
              <Typography variant="body1">
                {" "}
                {details.city.name}
              </Typography>
            </Typography>
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <FlagIcon />{" "}Country:{" "}
              <Typography variant="body1">
                {" "}
                {details.country.name}
              </Typography>
            </Typography>
            <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <MarkAsUnreadIcon />{" "}Pincode:{" "}
              <Typography variant="body1">
                {" "}
                {details.postalCode}
              </Typography>
              </Typography>
              <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              <ExploreIcon />{" "}long/lat:{" "}
              <Typography variant="body1">
                {" "}
                {details.location.longitude}{" "}/{" "}{details.location.latitude}
              </Typography>
              </Typography>

              {details.generalInfo && details.generalInfo.generalRule ? <Typography
              variant="h6"
              style={{ display: "flex", alignItems: "center" }}
            >
              General Infomation:{" "}
              <Typography variant="body1">
                {" "}
                {details.generalInfo.generalRule}
              </Typography>
              </Typography> : null}
          </Container>
        </>
      </>
    );
  }
};

export default VenueDetail;
