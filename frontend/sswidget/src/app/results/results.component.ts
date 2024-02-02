import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})


export class ResultsComponent {
  @Input() events: any[] = [];
  @Output() eventClicked = new EventEmitter<any>();

  
  selectedEvent: any;
  showEventDetails: any;

  openEventDetails(event: any) {
    this.eventClicked.emit(event);
  }
  
  getEventDate(event: any): string {
    return event.dates.start.localDate;
  }

  getEventTime(event: any): string {
    return event.dates.start.localTime;
  }

  getEventName(event: any): string {
    return event.name;
  }

  getEventGenre(event: any): string {
    const genres = event.classifications?.[0]?.segment?.name;
    return genres ? genres : '';
  }

  getEventVenue(event: any): string {
    return event._embedded.venues?.[0]?.name || '';
  }

  getEventIcon(event: any): string {
    return event.images?.[0]?.url;
  }

  sortEventsByDate(): void {
    this.events.sort((a, b) => {
      const aDate = new Date(`${a.dates.start.localDate} ${a.dates.start.localTime}`);
      const bDate = new Date(`${b.dates.start.localDate} ${b.dates.start.localTime}`);
      return aDate.getTime() - bDate.getTime();
    });
  }

  // onEventSelected(event: any) {
  //   this.selectedEvent = event;
  //   this.showEventDetails = true;
  // }
}

