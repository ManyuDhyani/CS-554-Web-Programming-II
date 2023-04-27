import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import { useQuery, useMutation, gql } from "@apollo/client";

export default function ImgMediaCard({location, userLocation}) {

  const GET_User_Location = gql`
  query {
      userPostedLocations {
          id
          name
          image
          address
          userPosted
          liked
      }
  }
  `;
  const { loading, error, data, refetch } = useQuery(GET_User_Location);

  const updateLocation_Mutation = gql`
    mutation updateLocation(
      $id: ID!
      $image: String
      $name: String
      $address: String
      $userPosted: Boolean
      $liked: Boolean
    ) {
      updateLocation(
        id: $id
        image: $image
        name: $name
        address: $address
        userPosted: $userPosted
        liked: $liked
      ) {
        id
        image
        name
        address
        userPosted
        liked
      }
    }
  `;
  const [mutate, { data:dataM, loading:loadingM, error: errorM }] = useMutation(updateLocation_Mutation);

  const handleLikeButton = () => {
    mutate({
      variables: {
        id: location.id,
        image: location.image,
        name: location.name,
        address: location.address,
        userPosted: location.userPosted,
        liked: !location.liked,
      },
    });
  };

  const deleteLocation_Mutation = gql `
    mutation deleteLocation($id: ID!){
      deleteLocation(id: $id) {
        id
        image
        name
        address
        userPosted
        liked
      }
    }
  `;
  const [deleteLocation,  { data: dataDelete, loading: loadingDelete, error: errorDelete }] = useMutation(deleteLocation_Mutation);

  const handleDeleteButton = async () => {
    await deleteLocation({
      variables: {
        id: location.id
      },
    });
    refetch();
  }

  const name = location?.name
  const thumbnail = location?.image
  const address = location?.address


  return (
    <Card sx={{ maxWidth: 345 }}>
      <div className="thumbnail" style={{backgroundImage:`url(${thumbnail})`}}></div>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {address}
        </Typography>
        <Button variant="outlined" sx={{ mx: 'auto', width: 200 }} onClick={handleLikeButton}>
          {location.liked ? <FavoriteIcon sx={{ color: red[500] }} /> : <FavoriteIcon  color="disabled" />}
          {location.liked ? "Remove like" : "Like"}
        </Button>
        {userLocation ? 
          <Button variant="outlined" sx={{ mx: 'auto', width: 200, my: 1}} onClick={handleDeleteButton}>
            <DeleteIcon  color="disabled" />
            delete
          </Button>  : null
      }
      </CardContent>
    </Card>
  );
}