import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
//import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PublicIcon from '@mui/icons-material/Public';

export default function ImgMediaCard({event}) {
  const name = event?.name
  const thumbnail = event?.images[0]?.url
  const date = event?.dates?.start?.localDate
  const time = event?.dates?.start?.localTime
  const timezone = event?.dates?.timezone
  const info = event?.info
  const seatmapURL = event?.seatmap?.staticUrl
  const id = event?.id
  // const priceData = event?.priceRanges || []
  // const minPrice = priceData.length ? priceData[0]?.min : 0
  // const maxPrice = priceData.length ? priceData[0]?.max : 0

  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* <CardMedia
        component="img"
        alt={name}
        height="140"
        image={thumbnail}
      /> */}
        <div className="thumbnail" style={{backgroundImage:`url(${thumbnail})`}}></div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography>
          <CalendarMonthIcon /> {" "}
          {date} {" "}{time}
        </Typography>
        {event.dates.timezone ?<Typography> <PublicIcon /> {" "}  {timezone} </Typography> : null}
        <Typography variant="body2" color="text.secondary" noWrap>
          {info}
        </Typography>
      </CardContent>
      <CardActions style={{justifyContent:"center"}}>
        <Button size="small" href={`/events/${id}`}>View Details</Button>
        <Button size="small" href={`${seatmapURL}`}>View SeatMap</Button>
      </CardActions>
    </Card>
  );
}