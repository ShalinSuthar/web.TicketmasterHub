import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sswidget';
  isHomeActive : boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe((event: any) => {
      console.log(event);
      if (event instanceof NavigationEnd ) {
        this.isHomeActive = (event.url!="/favorites");
      }
    });
    // console.log(this.router);
    // router.events.subscribe((url:any) => console.log(url));
    //   // console.log(router.url);  // to print only path eg:"/login"
    // this.isHomeActive = (router.url !== "favorites");
  }

  
  // ngOnInit() {
  //   this.router.events.subscribe((event: any) => {
  //     console.log(event);
  //     if (event instanceof NavigationEnd ) {
  //       this.isHomeActive = (event.url!="/favorites");
  //     }
  //   });
  //   // this.router.events.subscribe((url:any) => {
  //   //   this.isHomeActive = (!this.activatedRoute.snapshot.url.includes(favorites));
  //   //   console.log(url,"meeeeeeee")
  //   // });
  //   // console.log(router.url);  // to print only path eg:"/login"
  
  // }

  showHome() {
    this.router.navigate(['']);
    this.isHomeActive = true;
  }

  showFavorites() {
    this.router.navigate(['favorites']);
    this.isHomeActive = false;
  }
}