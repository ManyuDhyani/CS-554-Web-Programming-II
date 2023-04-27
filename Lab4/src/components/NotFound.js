import React from 'react';
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";

import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

const NotFound = () => {
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
};

export default NotFound;