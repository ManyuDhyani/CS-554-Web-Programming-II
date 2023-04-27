import React from "react";

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel'
import Input from '@mui/material/Input'

const Search = (props) => {
    const handleChange = (e) => {
      props.searchValue(e.target.value);
    };
    return (
      <FormControl
      method='POST'
      onSubmit={(e) => {
        e.preventDefault();
      }}
      name='formName'
      className='center'
    >
      <InputLabel htmlFor="search">Search
      </InputLabel>
      <Input
          id="search"
          autoComplete='off'
          type='text'
          name='searchTerm'
          onChange={handleChange}
        />
    </FormControl>
    );
  };
  
  export default Search;