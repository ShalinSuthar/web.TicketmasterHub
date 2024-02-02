import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../api-service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
//   result: any;
//   ssForm: any;

selectedEvent: any;
showEventDetails: any;
isLocationDisabled: boolean = false;
autoLocationValue: any;
  

  ssForm!: FormGroup;
  // categories = [
  //   { value: 'music', viewValue: 'Music' },
  //   { value: 'sports', viewValue: 'Sports' },
  //   { value: 'arts', viewValue: 'Arts' }
  // ];
  // selectedCategory: string = '';
  // selectedLocation: string = '';
  autoLocation = new FormControl();
  // autoLocation =  false;
  options: any = [];
  events: any = [];
  showEvents: boolean = false;
  isLoading: boolean = false;
  isLocationRequired: boolean = true;

  constructor(private apiService: ApiService, public fb: FormBuilder){}
  
  
  ngOnInit() {
    this.initForm();
  }


  initForm(){
    this.ssForm = this.fb.group({
      keywordControl : new FormControl('',Validators.required),
      category: new FormControl('Default'),
      distance: new FormControl(''),
      location: new FormControl(''),
      autoLocation: new FormControl(false)
    });
    this.ssForm.get('keywordControl')?.valueChanges
    .subscribe(entered => {
      console.log(entered,"here")
      if(entered?.length>=2){
        this.getKeywords(entered);
      }
     
    })
  }

  onLocationCheckChange(event: any){
    this.isLocationDisabled = event.checked;
    if(event.checked){
      this.ssForm.get('location')?.disable();
      this.isLocationRequired = false;
    }
    else{
      this.ssForm.get('location')?.enable();
      this.ssForm.get('location')?.setValue('');
      this.isLocationRequired = true;
    }
    if(this.ssForm && this.ssForm.get('autoLocation')?.value){
      this.apiService.getAutoLocation().then((data: any) => {
        console.log(data);
        this.autoLocationValue = data.loc;
        this.ssForm.patchValue({
          'location': data.loc
        });
        // this.ssForm.setValue({
        //   'location' : `${data.loc}`
        // });
      });
    } else {
      this.ssForm.patchValue({
        'location': ''
      });
    }
  }

  onSubmit() {
    if(this.ssForm.invalid){
      
    }
    else{
      this.showEventDetails = false;
      this.showEvents = false;
      console.log(this.ssForm.value);
    let { keywordControl, distance, category, autoLocation, location } = this.ssForm.value;
    console.log(this.ssForm);
    if(!distance){
      distance = 10;
    }
    if(autoLocation){
      location = this.autoLocationValue;
    }
    this.apiService.search(keywordControl, distance, category, location, autoLocation)
      .subscribe((data:any) => {
        console.log(data)
        let results = data?._embedded?.events;

        // this.result = data;
        this.showEvents = true;
        if(results?.length > 0){
          this.events = this.sortEvents(results);
        }
        else{
          this.events = results;
        }
        //Check if correct
      });
    }
  }

  sortEvents(events: any[]) {
    events.sort((a, b) => {

      const aDateTime = new Date(a?.dates?.start?.dateTime ? a?.dates?.start?.dateTime : a?.dates?.start?.localDate).getTime();
      const bDateTime = new Date(b?.dates?.start?.dateTime ? b?.dates?.start?.dateTime : b?.dates?.start?.localDate).getTime();
      return aDateTime - bDateTime;
    });
    return events;
  }

  onClear() {
    this.ssForm.reset();
    this.ssForm.get('location')?.enable();
    this.ssForm.patchValue({
      'autoLocation': false,
      'category':'Default',
      'distance': 10
    });
    this.events = '';
    this.showEvents = false;
    this.showEventDetails = false;
    this.isLocationDisabled = false;
  }

getKeywords(data: any){
  this.isLoading = true;
  this.apiService.keywordAutoComplete(data).subscribe(res => {
    this.isLoading = false;
    console.log("res", res)
    this.options = res;
  },
  error=>{
    console.log(error);
      this.isLoading = false;
  })
}

handleEventClicked(event: any) {
  this.selectedEvent = event;
  this.showEventDetails = true;
}

onEventSelected(event: any) {
  this.selectedEvent = event;
  this.showEventDetails = true;
}
}
