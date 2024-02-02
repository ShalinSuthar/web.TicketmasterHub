import ngeohash from "ngeohash";
const  GOOGLEMAPAPIKEY = process.env.GOOGLEMAPAPIKEY; 
const TicketmasterKey = process.env.TICKETMASTER_KEY;

export function geoCoding(coordinates){
    const corArray = coordinates.split(",");
    const lat = corArray[0];
    const long = corArray[1];
    return ngeohash.encode(lat,long,7)
}

export async function getCoordinates(location){
    let apikey = "AIzaSyBkev7ew2xjZmiFrInIWH943EnyDnQ3MWU";
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apikey}`;
    try {

        const res =  await fetch(url);
        console.log("res",res)
        const data = await  res.json();
        console.log(data);
        return data;
        // if(data.results && data.results.length > 0){
        //     lati = data["results"][0]["geometry"]["location"]["lat"];
        //     longi = data["results"][0]["geometry"]["location"]["lng"];
        //     return (lati.toString() +","+ longi.toString());
        // }
        // return "location unavailable";
      } catch (error) {
        console.log(error);
        res.status(500).send('Error fetching data from Google maps API');
      }
}

export async function searchTicketMaster(paramObj){
    let query = new URLSearchParams(paramObj).toString();
    const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?${query}`;
    console.log("api call: ",apiUrl)
  // apikey=${TicketmasterKey}&keyword=${resParam.keyword}&distance=${resParam.distance}&classificationName=${resParam.category}&latlong=${resParam.location}`;
  try {

    const res = await fetch(apiUrl);
    const data = await res.json();
    console.log(data);
    // res.send(data);
    return data
  } catch (error) {
    console.log(error);
    return ('Error fetching data from Ticketmaster API');
  }
}

export async function TicketmasterEventDetails(eventId){
  const apiKey = "YiJwCKdhUXMMRUEwGCCm01q3Jq6IAeTu";
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${apiKey}`;
  console.log("api call: ",apiUrl)
// apikey=${TicketmasterKey}&keyword=${resParam.keyword}&distance=${resParam.distance}&classificationName=${resParam.category}&latlong=${resParam.location}`;
try {

  const res = await fetch(apiUrl);
  const data = await res.json();
  console.log(data);
  // res.send(data);
  return data
} catch (error) {
  console.log(error);
  return ('Error fetching data from Ticketmaster Event Details API');
}
}

export async function TicketmasterVenueDetails(keyword){
  let apiKey = "YiJwCKdhUXMMRUEwGCCm01q3Jq6IAeTu"
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/venues?apikey=${apiKey}&keyword=${keyword}`;
  console.log("api call: ",apiUrl)
// apikey=${TicketmasterKey}&keyword=${resParam.keyword}&distance=${resParam.distance}&classificationName=${resParam.category}&latlong=${resParam.location}`;
try {

  const res = await fetch(apiUrl);
  const data = await res.json();
  console.log(data);
  // res.send(data);
  return data
} catch (error) {
  console.log(error);
  return ('Error fetching data from Ticketmaster Event Details API');
}
}

export async function ticketMasterSuggest(input){
  console.log(input)
  let apiKey = "YiJwCKdhUXMMRUEwGCCm01q3Jq6IAeTu"
    const apiUrl = `https://app.ticketmaster.com/discovery/v2/suggest?apikey=${apiKey}&keyword=${input}`;
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        console.log(data);
        let events = data._embedded.attractions;
        let attractions = events.map(attraction => attraction.name);
        console.log(attractions, apiUrl)
        // const suggestions = res.data._embedded?.attractions?.map((attraction) => attraction.name);
    
        return (attractions);
    } catch (error) {
        console.error(error);
        return ('Internal Server Error');
    }
}