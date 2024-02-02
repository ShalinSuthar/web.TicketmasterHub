import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl  } from '@angular/platform-browser';
import { ApiService } from '../api-service';
import { GoogleMapModalComponent } from '../google-map-modal/google-map-modal.component';

@Component({
  selector: 'app-detailstab',
  templateUrl: './detailstab.component.html',
  styleUrls: ['./detailstab.component.css']
})
export class DetailstabComponent {

  @Input() event: any;

  @Output() goBackEvent = new EventEmitter<void>();

  goBack() {
    this.goBackEvent.emit();
  }

  modalOpen: boolean = false;
  latitude: number = 37.7749;
  longitude: number = -122.4194;
  zoom: number = 12;

  eventDetails: any;
  venueDetails: any;
  artistList : any;
  albumList: any;
  isFavoriteEvent: boolean = false;
  attrList: any = "";
  genreList: any = "";
  venueAddress: any = "";
  showMore1: boolean = false;
  showMore2: boolean = false;
  showMore3: boolean = false;
  noMusicArtists: boolean = false;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom : 14
 }
  statusMapColor:any = {
    "onsale": "green",
    "offsale": "red",
    "cancelled": "black",
    "postponed": "orange",
    "rescheduled": "orange",
    "canceled": "black"
}

statusMapText: any = {
    "onsale": "On Sale",
    "offsale": "Off Sale",
    "cancelled": "Cancelled",
    "postponed": "Postponed",
    "rescheduled": "Rescheduled",
    "canceled": "Canceled"
}

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer, public dialog: MatDialog){}

  ngOnInit() {
    this.showMore1 = false;
    this.showMore2 = false;
    this.showMore3 = false;
    this.noMusicArtists = false;
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.isFavoriteEvent = favorites.some((f:any) => f.id === this.event.id);
    this.getEventDetails(this.event.id);
    this.getVenueDetails(this.event._embedded?.venues[0]?.name);
  }


  openModal() {
    this.modalOpen = true;
    
  }

  closeModal() {
    this.modalOpen = false;
  }

  generateFacebookShareUrl(): SafeUrl {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.event.url)}`;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  generateTwitterShareUrl(): SafeUrl {
    const text = `Check ${this.event.name} on TicketMaster ${this.event.url}`;
    const encodedText = encodeURIComponent(text);
    const url = `https://twitter.com/intent/tweet?text=${encodedText}`;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  createAttrList(){
    let attractions = this.event?._embedded?.attractions;
       if(attractions && attractions?.length){
        for (let attraction of attractions) {
          this.attrList += attraction.name +` | `;
      }
    this.attrList = this.attrList.slice(0, -3);
    console.log(this.attrList,"%%%%%%%%%%");
       }
        
  }

  getArtistDetails(){
    console.log("event specific details: ", this.eventDetails)
    let result: any = [];
    let artistList = [];
    let albums: any = [];
  //   const artists = this.eventDetails._embedded.attractions
  //   .filter((artist:any) => {
  //     const musicSegment = artist.classifications.flatmap().find((c: any) => c.segment?.name?.toLowerCase() === "music")?.[0];
  //     return musicSegment !== undefined;
  //   });
  // const artistNames = artists.map((artist:any) => artist.name);
  const attractions = this.eventDetails._embedded?.attractions ?? [];
  const musicArtists = attractions.filter((attraction: any) => {
    const classifications = attraction.classifications ?? [];
    const musicSegment = classifications.find((classification: any) => {
      return classification.segment?.name === "Music";
    });
    return musicSegment !== undefined;
  });
  const musicArtistNames = musicArtists.map((attraction: any) => attraction.name);
  console.log(musicArtistNames);
  if(!musicArtistNames?.length){
    this.noMusicArtists = true;
  
  }
    for (let artistName of musicArtistNames){
      this.apiService.getArtistSpotify(encodeURIComponent(artistName)).subscribe((data: any)=>{
        let id = data?.id;
        if(id){
          this.apiService.getArtistAlbums(id).subscribe((res: any)=>{
            albums.push(res);
          });
        }
        
        if(data && data != null){
          result.push(data);
        }
        
      });
      
    }
    this.artistList = (result && !result.includes(null))? result  : [];
    console.log(this.artistList, "artistList.....................");
    this.albumList = albums ? albums: [];
    console.log(this.albumList, "AlbumList.....................")
    // if(this.artistList?.length == 0){
    //   this.noMusicArtists = true;
    // }
  }

  createGenreList(){
    let classifications = this.event.classifications;

        let classification = classifications[0];
        let genre = classification.genre ? classification.genre.name : "";
        let segment = classification.segment ? classification.segment.name : "";
        let subGenre = classification.subGenre ? classification.subGenre.name : "";
        let subType = classification.subType ? classification.subType.name : "";
        let type = classification.type ? classification.type.name : "";
        let details = [segment, genre, subGenre, type, subType];
        let gc = details.filter(c => (c.toLowerCase() != "undefined" && c != "")).join(" | ");

        this.genreList = gc;
  }

  getArtistAlbums(){
    if(this.artistList?.length == 0){
        this.noMusicArtists = true;
    }
    if(this.noMusicArtists){
      
    }
    else{
      let result: any = [];
    let list = this.artistList;
    console.log(this.artistList,"artist list 1111")
    for (let artist of list){
      console.log("inside for",artist?.id);
      let id = artist?.id;
      this.apiService.getArtistAlbums(id).subscribe((data: any)=>{
        result.push(data);
      });
    }
    // this.artistList.forEach((artist: any) => {
      
    // });
    
    console.log("artist albums: ",result);
    }
    
  }
  
  getEventDetails(eventId: string) {
    this.apiService.getEventDetails(eventId).subscribe((data: any) => {
      this.eventDetails = data;
      this.createAttrList();
      this.createGenreList();
      this.getArtistDetails();
    });
  }

  manageFavorites(){
    if(!this.isFavoriteEvent){
      let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      favorites.push(this.event);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.isFavoriteEvent = true;
      alert("Event added to Favorites!");
    }
    else{
      let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      let index = favorites.findIndex((f:any) => f.id === this.event?.id);
      if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        this.isFavoriteEvent = false;
        alert("Removed from favorites!");
      }
    }
  }
  
  getVenueDetails(venueId: string) {
    this.apiService.getVenueDetails(venueId).subscribe((data: any) => {
      this.venueDetails = data;
      console.log("venue specific details: ", this.venueDetails)
      this.createVenueAddress();
    });
  }

  createVenueAddress(){
    
    if (this.venueDetails?._embedded?.venues?.[0]?.address?.line1 && this.venueDetails?._embedded?.venues[0].address?.line1?.toLowerCase() != "undefined"){
      this.venueAddress += this.venueDetails?._embedded?.venues?.[0]?.address?.line1;
    }
    if ((this.venueDetails?._embedded?.venues[0]?.city?.name && this.venueDetails?._embedded?.venues[0]?.city?.name?.toLowerCase() != 'undefined') || (this.venueDetails?._embedded?.venues[0]?.state?.stateCode && this.venueDetails?._embedded?.venues[0]?.state?.stateCode?.toLowerCase() != 'undefined')) {
      this.venueAddress += ", "+ this.venueDetails?._embedded?.venues[0]?.city.name + this.venueDetails?._embedded?.venues[0]?.state?.stateCode;
    }
    // if (this.venueDetails?._embedded?.venues[0]?.postalCode && this.venueDetails?._embedded?.venues[0]?.postalCode?.toLowerCase() != 'undefined') {
    //   this.venueAddress += ", "+ this.venueDetails?._embedded?.venues[0]?.postalCode;
    // }
    
  }

  openGoogleMapModal(): void {
    const dialogRef = this.dialog.open(GoogleMapModalComponent, {
      // width: '345px',
      // height: '492px',
      disableClose: true,
      data: {
        lat: this.venueDetails?._embedded?.venues?.[0]?.location?.latitude,
        lng: this.venueDetails?._embedded?.venues?.[0]?.location?.longitude
      }
    });
  }
}

