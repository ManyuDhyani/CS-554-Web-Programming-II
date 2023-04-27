import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function ImgMediaCardAttraction({attraction}) {
    const name = attraction?.name
    const thumbnail = attraction?.images?.length ? attraction?.images[0]?.url : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
    const id = attraction?.id

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

        </CardContent>
        <CardActions style={{justifyContent:"center"}}>
            <Button size="small" href={`/attractions/${id}`}>View Attractions Details</Button>
        </CardActions>
        </Card>
    );
}