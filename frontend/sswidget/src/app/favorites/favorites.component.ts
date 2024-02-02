import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  events : any;
  noEvents: boolean = false;
  constructor(private apiService: ApiService, private fb: FormBuilder) { 
   
  }

  ngOnInit() {
    this.events = JSON.parse(localStorage.getItem('favorites') || '[]');
    if(!this.events || !this.events.length){
      this.noEvents = true;
    }
    else{
      for (let event of this.events){
        event['category'] = this. makeCategoryList(event);
      }
    }
  }

  makeCategoryList(event: any){
    let classification = event?.classifications?.[0];
        let genre = classification.genre ? classification.genre.name : "";
        let segment = classification.segment ? classification.segment.name : "";
        let subGenre = classification.subGenre ? classification.subGenre.name : "";
        let subType = classification.subType ? classification.subType.name : "";
        let type = classification.type ? classification.type.name : "";
        let details = [segment, genre, subGenre, type, subType];
        let gc = details.filter(c => (c.toLowerCase() != "undefined" && c != "")).join(" | ");
        return gc;
  }

  removeEvent(event: any) {
    let index = this.events.findIndex((f:any) => f.id === event?.id);
      if (index !== -1) {
        this.events.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(this.events));
      }
      alert('Removed from favorites!');
      this.events = JSON.parse(localStorage.getItem('favorites') || '[]');
      if(!this.events || !this.events.length){
        this.noEvents = true;
      }
  }

}
