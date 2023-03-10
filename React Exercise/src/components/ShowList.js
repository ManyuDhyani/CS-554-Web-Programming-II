import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles, Button } from '@material-ui/core';

import '../App.css';
const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});
const ShowList = (props) => {
	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ showsData, setShowsData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [prevPage, setPrevPage] = useState(false);
	const [nextPage, setNextPage] = useState(false)
	const [isEmpty, setIsEmpty] = useState(false);
	const [invalidPagenum, setInvalidPagenum] = useState(false);
	let card = null; 
	let pageNumber = Number(props.match.params.pagenum);
 
	useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			try {

				// Validating Page Number
				if (Number(props.match.params.pagenum) < 0) setInvalidPagenum(true);
				if (/^[0-9a-zA-Z .,@&():;!]+$/.test(props.match.params.pagenum) === true){
				  if(/^[0-9]*$/.test(props.match.params.pagenum) === false) {
					setInvalidPagenum(true);
				  }
				}

				const { data } = await axios.get(`http://api.tvmaze.com/shows?page=${props.match.params.pagenum}`);
				setShowsData(data);
				setLoading(false);

				// If prev page doesn't exist then set prev page to false and same for next page
				setNextPage(true);
				setPrevPage(true);
				try {
					await axios.get(`http://api.tvmaze.com/shows?page=${Number(props.match.params.pagenum) - 1}`);
				} catch (e) {
					setPrevPage(false);
				}
				try {
					await axios.get(`http://api.tvmaze.com/shows?page=${Number(props.match.params.pagenum) + 1}`);
				} catch (e) {
					setNextPage(false);
				}

			} catch (e) {
				setIsEmpty(true);
			}
		}
		fetchData();
	}, [props.match.params.pagenum]);

	useEffect(
		() => {
			console.log('search useEffect fired');
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
					const { data } = await axios.get('http://api.tvmaze.com/search/shows?q=' + searchTerm);
					setSearchData(data);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				console.log ('searchTerm is set')
				fetchData();
			}
		},
		[ searchTerm ]
	);

	// Pagination
	const pagination = (pageNumber) => {
		if(!prevPage) {
			return (
				<div>
					<Link to={`/shows/page/${pageNumber + 1}`}>
            			<Button variant='outlined'>Next</Button>
          			</Link>
				</div>
			)
		} else if (!nextPage) {
			return (
				<div>
					<Link to={`/shows/page/${pageNumber - 1}`}>
            			<Button variant='outlined'>Previous</Button>
          			</Link>
				</div>
			)
		} else {
			return (
				<div>
					<Link to={`/shows/page/${pageNumber - 1}`}>
						<Button variant='outlined'>Previous</Button>
					</Link>
					<Link to={`/shows/page/${pageNumber + 1}`}>
						<Button variant='outlined'>Next</Button>
					</Link>
				</div>
			)
		}
	};

	const Pagination = pagination(pageNumber);

	const searchValue = async (value) => {
		setSearchTerm(value);
	};
	const buildCard = (show) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/shows/${show.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={show.image && show.image.original ? show.image.original : noImage}
								title='show image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
									{show.name}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{show.summary ? show.summary.replace(regex, '').substring(0, 139) + '...' : 'No Summary'}
									<span>More Info</span>
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

	if (searchTerm) {
		card =
			searchData &&
			searchData.map((shows) => {
				let { show } = shows;
				return buildCard(show);
			});
	} else {
		card =
			showsData &&
			showsData.map((show) => {
				return buildCard(show);
			});
	}

	if (invalidPagenum){
		return (
			<div>
				<h2>Invalid Page Number.</h2>
			</div>
		);
	}

	if (isEmpty){
		return (
			<div>
				<h2>No more Movies - 404.</h2>
			</div>
		);
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
		return (
			<div>
				<SearchShows searchValue={searchValue} />
				<br />
				{ !searchTerm ? Pagination : null }
				<br />
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}
};

export default ShowList;
