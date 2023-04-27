import React, { useState, useEffect } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import ImgMediaCard from "./Card";

import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

import { useParams } from "react-router-dom";
import Search from "./Search";

const Event = (props) => {
  const [events, setEvent] = useState(undefined);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInvalidURL, setIsInvalidURL] = useState(false);

  const { page } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {

        // Validating Page Number
				if (Number(page) < 1) setIsInvalidURL(true);
				if (/^[0-9a-zA-Z .,@&():;!]+$/.test(page) === true){
				  if(/^[0-9]*$/.test(page) === false) {
            setIsInvalidURL(true);
				  }
				}

        if (Number(page) > 0) setIsInvalidURL(false);

        let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=20&apikey=IWGlPY8O4dZ77LliNtcfwoMMbFg7GRn9&page=${
          page - 1
        }&countryCode=US`;
        const { data } = await axios.get(url);
        setEvent(data._embedded.events);
        setLoading(false);
        setIsError(false);
      } catch (e) {
        console.error(e);
        setIsEmpty(true);
        setIsError(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [isEmpty, page, isError]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=IWGlPY8O4dZ77LliNtcfwoMMbFg7GRn9&countryCode=US&keyword=${searchTerm}`
        );
        setEvent(data._embedded.events);
        setLoading(false);
        setIsError(false);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    if (searchTerm) {
      fetchData();
    }
  }, [searchTerm]);

  const getPage = () => {
    let num = parseInt(page);
    return num;
  };

  const searchValue = async (value) => {
    setSearchTerm(value);
    if (value.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  };
  
  if (isInvalidURL)
    return (
      <>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6">
              <HourglassBottomIcon /> 400 - Bad Request - Invalid URL
            </Typography>
          </Toolbar>
        </AppBar>
      </>
    );

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
          Events
        </Typography>

        <Search searchValue={searchValue} />

        {!searchTerm ? (
          <Container maxWidth="md" style={{ padding: "10px" }}>
            {getPage() > 1 && (
              <Button
                variant="outlined"
                color="primary"
                href={`/events/page/${getPage() - 1 ? getPage() - 1 : 0}`}
              >
                Previous
              </Button>
            )}
            <span style={{ padding: "10px", fontSize: "1.1rem" }}>{page}</span>
            {getPage() < 50 && (
              <Button
                variant="outlined"
                color="primary"
                href={`/events/page/${getPage() + 1}`}
              >
                Next
              </Button>
            )}
          </Container>
        ) : null}
        <>
          <div className="cardLayout">
            {events?.map((event) => (
              <div>
                <ImgMediaCard event={event} />
              </div>
            ))}
          </div>
        </>
      </>
    );
  }
};

export default Event;
