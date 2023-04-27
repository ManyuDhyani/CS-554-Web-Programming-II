import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import PlaceIcon from '@mui/icons-material/Place';
import FlagIcon from '@mui/icons-material/Flag';

export default function ImgMediaCardVenue({venue}) {
    const name = venue?.name
    const thumbnail = venue?.images?.length ? venue?.images[0]?.url : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
    const city = venue?.city?.name
    const state = venue?.state?.name
    const country = venue?.country?.name
    const address = venue?.address?.line1
    const pincode = venue?.postalCode
    const generalInfo = venue?.generalInfo?.generalRule
    const id = venue?.id

    const venueAddress = address+", "+city+", "+state+" - "+pincode

    return (
        <Card sx={{ maxWidth: 345 }}>
        {/* <CardMedia
            component="img"
            alt="green iguana"
            height="140"
            image={thumbnail}
        /> */}
        <div className="thumbnail" style={{backgroundImage:`url(${thumbnail})`}}></div>

        <CardContent>

            <Typography gutterBottom variant="h5" component="div">
                {name}
            </Typography>

            <Typography>
                <PlaceIcon />
                {venueAddress}
            </Typography>

            <Typography>
                <FlagIcon />
                {country}
            </Typography>

            <Typography variant="body2" color="text.secondary" noWrap>
                {generalInfo}
            </Typography>

        </CardContent>
        <CardActions style={{justifyContent:"center"}}>
            <Button size="small" href={`/venues/${id}`}>View Venue Details</Button>
        </CardActions>
        </Card>
    );
}