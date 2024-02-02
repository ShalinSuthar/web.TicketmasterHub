
let accessToken = null;
let spotifyApiLocal = null;

export async function setNewAccessToken(spotifyApi){
    spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    let token = data.body['access_token']
    // Save the access token so that it's used in future calls
    return token;
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
)};


export async function searchArtists(artistName, spotifyApi) {
  let result = null;
  console.log("#########", spotifyApi)

  try {
    result = await spotifyApi.searchArtists(artistName);
  } catch (err) {
    // If we receive a 401 error, assume the access token has expired
    // and try setting a new access token
    // if (err.statusCode === 401 && accessToken) {
    //     try {
    //         spotifyApi.clientCredentialsGrant().then(
    //             function(data) {
    //               console.log('The access token expires in ' + data.body['expires_in']);
    //               console.log('The access token is ' + data.body['access_token']);
              
    //               // Save the access token so that it's used in future calls
    //               spotifyApi.setAccessToken(data.body['access_token']);
    //             //   result = await spotifyApi.searchArtists(artistName);
    //             },
    //             function(err) {
    //               console.log('Something went wrong when retrieving an access token', err);
    //             }
    //           );
          
    //     } catch (refreshError) {
          // console.error('Error refreshing access token:', refreshError);
          // throw err;
    //     }
    // } else {
      console.error('Error searching for artist:', err);
      throw err;
    // }
  }

  return result.body.artists.items[0];
}

export async function searchArtistAlbums(artistID, spotifyApi) {
    let result = null;
    console.log("#########", spotifyApi)
  
    try {
      result = await spotifyApi.getArtistAlbums(artistID,{limit: 3});
    } catch (err) {
      // If we receive a 401 error, assume the access token has expired
      // and try setting a new access token
      // if (err.statusCode === 401 && accessToken) {
      //   try {
      //       spotifyApi.clientCredentialsGrant().then(
      //           function(data) {
      //             console.log('The access token expires in ' + data.body['expires_in']);
      //             console.log('The access token is ' + data.body['access_token']);
              
      //             // Save the access token so that it's used in future calls
      //             spotifyApi.setAccessToken(data.body['access_token']);
      //           //   result = await spotifyApi.getArtistAlbums(artistName);
      //           },
      //           function(err) {
      //             console.log('Something went wrong when retrieving an access token', err);
      //           }
      //         );
          
      //   } catch (refreshError) {
      //     console.error('Error refreshing access token:', refreshError);
      //     throw err;
      //   }
      // } else {
        console.error('Error searching for artist:', err);
        throw err;
      // }
    }
    console.log("albums list*****",result)
    return result.body;
  }

// module.exports = {
//   setNewAccessToken,
//   searchArtists,
// };
