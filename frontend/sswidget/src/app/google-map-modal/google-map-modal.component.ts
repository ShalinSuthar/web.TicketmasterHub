import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-google-map-modal',
  templateUrl: './google-map-modal.component.html',
  styleUrls: ['./google-map-modal.component.css']
})
export class GoogleMapModalComponent {
  mapOptions: google.maps.MapOptions = {
    zoom: 12
  };

  markerPosition: google.maps.LatLngLiteral = {
    lat: 0.0,
    lng: 0.0
  };

  constructor(
    public dialogRef: MatDialogRef<GoogleMapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mapOptions["center"] = {
      lat: Number(data.lat),
      lng: Number(data.lng)
    };
    this.markerPosition = {
      lat: Number(data.lat),
      lng: Number(data.lng)
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}