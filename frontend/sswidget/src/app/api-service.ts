import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  search(keyword: string, distance: number, category: string, location: string, autolocation: boolean) {
    const url = `/search?keyword=${keyword}&distance=${distance}&category=${category}&location=${location}&autolocation=${autolocation}`;
    return this.http.get(url);
  }

  getAutoLocation(){
    const url = `https://ipinfo.io/json?token=${environment.ipinfoApiKey}`;

    return fetch(url)
      .then(response => response.json())
      .catch(error => console.error(error));
  }

  keywordAutoComplete(input: string){
    const url = `/autocomplete?input=${input}`;
    return this.http.get(url);
  }

  getEventDetails(input: string){
    const url = `/eventdetails?input=${input}`;
    return this.http.get(url);
  }

  getVenueDetails(input: string){
    const url = `/venuedetails?input=${input}`;
    return this.http.get(url);
  }

  getArtistSpotify(artistName: string){
    const url = `/getArtistSpotify?artist=${artistName}`;
    return this.http.get(url);
  }

  getArtistAlbums(artistID: any){
    const url = `/getArtistAlbums?id=${artistID}`;
    return this.http.get(url);
  }
}
