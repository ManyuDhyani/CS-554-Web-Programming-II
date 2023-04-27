import React , {useEffect, useState} from 'react'
import { useQuery, useMutation, gql } from "@apollo/client";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Button from '@mui/material/Button';

import '../form.css'


import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ImgMediaCard from "./Card";

function UserLocation() {
    const GET = gql`
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
    const { loading, error, data, refetch } = useQuery(GET);

    const userLocation_refetch = () =>{
        refetch();
    }
    
    useEffect(()=>{
        userLocation_refetch();
    }, [data])


    
    const [image, setImageURL] = useState('')
    const [address, setAddress] = useState('')
    const [name, setName] = useState('')

    const handleImage = (e) => {
        setImageURL(e.target.value)
    }
    const handleAddress = (e) => {
        setAddress(e.target.value)
    }
    const handleName = (e) => {
        setName(e.target.value)
    }

    const newLocation_Mutation = gql`
        mutation uploadLocation($image:String!, $address: String, $name: String){
            uploadLocation(image: $image, name: $name, address: $address) {
                image
                address
                name
            }
        }
    `;
    const [uploadLocation, {loading: loadingM, error: errorM, data: dataM}] = useMutation(newLocation_Mutation, {
        refetchQueries: [
            {query: GET},
            'userPostedLocations'
        ]
    });

    const handleSubmit = async(e)=>{
        e.preventDefault();

        if (!image) {
            alert('Image field is required.');
            return;
          }
    
        try {
            await uploadLocation({
                variables: {
                    image: image,
                    address: address,
                    name: name
                }
            });
            setImageURL('');
            setAddress('');
            setName('');
        } catch (e) {
            console.error(e);
        }
    }

    
    if (loading)
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

    
    if (error)
        return (
            <>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                <Typography variant="h6">
                    <HourglassBottomIcon /> 404 - Something went wrong with the server
                </Typography>
                </Toolbar>
            </AppBar>
            </>
        );

    return (
        <>
            <CssBaseline />
            <Typography variant="h6" padding={"10px"}>
                User Location
            </Typography>

            <form
            onSubmit={handleSubmit}
            >
                <label htmlFor="image">Image</label>
                <input id="image" onChange={handleImage} value={image} required />

                <label htmlFor="address">Address</label>
                <input id="address" onChange={handleAddress} value={address} />

                <label htmlFor="name">Name</label>
                <input id="name" onChange={handleName} value={name} />

                <Button type="submit">Submit</Button>
            </form>

            {data.userPostedLocations.length === 0 ? <p>No user posted locations</p>: null}

            <div className="cardLayout">
            {data.userPostedLocations &&
            data.userPostedLocations.map((location) => (
            <div>
                <ImgMediaCard location={location} userLocation={true}/>
            </div>
            ))}
        </div>
       </>
    )
}

export default UserLocation;