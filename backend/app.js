console.log("I am in the NODE backend");
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import {geoCoding, getCoordinates, searchTicketMaster, ticketMasterSuggest, TicketmasterEventDetails, TicketmasterVenueDetails } from "./services/api-service.js"
dotenv.config();
import { searchArtists, searchArtistAlbums } from './services/spotify-service.js'; 
import SpotifyWebApi from 'spotify-web-api-node';
import path from 'path';
// const env = require('dotenv');
const app = express();
const port = process.env.PORT || 3000;

const TicketmasterKey = process.env.TICKETMASTER_KEY;
const  TicketmasterSecret = process.env.TICKETMASTER_SECRET;

// const __dirname = path.dirname(new URL(import.meta.url).pathname);

// console.log(__dirname,"................dir name here");
app.use(express.static('dist/sswidget'));


const spotifyApi = new SpotifyWebApi({
  clientId: '225c3d05a3ac4e999f069c480ccedc26', 
  clientSecret: 'df1caaaa2f71441ea2a819dd63544e75'
});


// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/sswidget/index.html'));
// });

spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    
    console.log('Something went wrong when retrieving an access token', err);
  }
);

// app.get('*',(req,res)=>{
//   const absolutePath = path.resolve(process.cwd(),'dist','sswidget', 'index.html');
//   res.sendFile(absolutePath);
// })


// let token = await setNewAccessToken(spotifyApi);



app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// async function retrySearchArtist(){
//   spotifyApi.clientCredentialsGrant().then(
//     function(data) {
//       console.log('The access token expires in ' + data.body['expires_in']);
//       console.log('The access token is ' + data.body['access_token']);
  
//       // Save the access token so that it's used in future calls
//       spotifyApi.setAccessToken(data.body['access_token']);
//       const result = await searchArtists(artistName, spotifyApi);
//       res.json(result),
//       function(err) {
//         console.log('Something went wrong when retrieving an access token', err);
//       }
    
//     });
// }

// async function retryGetAlbums(){
//   spotifyApi.clientCredentialsGrant().then(
//     function(data) {
//       console.log('The access token expires in ' + data.body['expires_in']);
//       console.log('The access token is ' + data.body['access_token']);
  
//       // Save the access token so that it's used in future calls
//       spotifyApi.setAccessToken(data.body['access_token']);
//       const result = await searchArtists(artistName, spotifyApi);
//       res.json(result),
//       function(err) {
//         console.log('Something went wrong when retrieving an access token', err);
//       }
    
//     });
// }
app.get('/getArtistSpotify', async (req, res) => {
  const artistName = req.query.artist;
  console.log("artistname......", artistName)

  try {
    // spotifyApi.setAccessToken(token);
    const result = await searchArtists(artistName, spotifyApi);
    res.json(result);
  } catch (err) {
    if (err.statusCode === 401){
      spotifyApi.clientCredentialsGrant().then(
        async function(data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
      
          
          spotifyApi.setAccessToken(data.body['access_token']);
          const result = await searchArtists(artistName, spotifyApi);
          // const artistDetails = result.items[0];
          res.json(result);
        },
        function(err) {

          console.log('Something went wrong when retrieving an access token', err);
        }
      );
    } 
    else{
      console.error('Error searching for artist:', err);
    res.status(500).send('Error searching for artist');
    }
    
  }
});

app.get('/getArtistAlbums', async (req, res) => {
  const artistID = req.query.id;

  try {
    // spotifyApi.setAccessToken(token);
    const result = await searchArtistAlbums(artistID, spotifyApi);
    res.json(result);
  } catch (err) {
    if (err.statusCode === 401){
      spotifyApi.clientCredentialsGrant().then(
        async function(data) {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
      
          
          spotifyApi.setAccessToken(data.body['access_token']);
          const result = await searchArtists(artistName, spotifyApi);
          res.json(result);
        },
        function(err) {
          
          console.log('Something went wrong when retrieving an access token', err);
        }
      );
    } 
    else{
      console.error('Error searching for artist:', err);
    res.status(500).send('Error searching for artist album');
    }
    
  }
});

app.get('/search', async (req, res) => {
  
  console.log("in search query param", req.query)
  const categoryMap = {
    'Music': "KZFzniwnSyZfZ7v7nJ",
    'Sports': "KZFzniwnSyZfZ7v7nE",
    'ArtsTheatre': "KZFzniwnSyZfZ7v7na",
    'Film': "KZFzniwnSyZfZ7v7nn",
    'Miscellaneous': "KZFzniwnSyZfZ7v7n1"
  }; 
  let resParam = {
    "apikey": `${TicketmasterKey}`,
    "keyword": `${req.query.keyword}`,
    "unit": "miles",
    "radius": `${req.query.distance}`,
  };
  if(req.query.category!="Default"){
    resParam["segmentId"] = categoryMap[`${req.query.category}`]
  }
  let coordinates = req.query.location;
  if(req.query.autolocation == "false"){
    let data = await getCoordinates(`${req.query.location}`);
    if(data.results && data.results.length > 0){
      let lati = data["results"][0]["geometry"]["location"]["lat"];
      let longi = data["results"][0]["geometry"]["location"]["lng"];
      coordinates =  lati.toString() +","+ longi.toString();
  }
}
  resParam["geoPoint"] = geoCoding(coordinates)
  // const { keyword, distance, category, location } = req.query;
  console.log('received query',resParam);
  const data = await searchTicketMaster(resParam);
  console.log(data);
  res.send(data);
});


app.get('/autocomplete', async (req, res) => {
  const input = req.query.input;
  let keywords = await ticketMasterSuggest(input);
  console.log("ddddd",keywords,"kkkkkkkk")
  res.send(keywords);
});

app.get('/eventdetails', async (req, res) => {
  const input = req.query.input;
  let eventDetails = await TicketmasterEventDetails(input);
  console.log("ddddd",eventDetails,"kkkkkkkk")
  res.send(eventDetails);
});

app.get('/venuedetails', async (req, res) => {
  const input = req.query.input;
  let venueDetails = await TicketmasterVenueDetails(input);
  console.log("ddddd",venueDetails,"kkkkkkkk")
  res.send(venueDetails);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
