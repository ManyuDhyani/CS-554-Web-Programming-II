import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import Button from '@mui/material/Button';

import '../form.css'


function NewLocation() {
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
    const [uploadLocation, {loading, error, data}] = useMutation(newLocation_Mutation);

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

    return (
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
    )
}

export default NewLocation;