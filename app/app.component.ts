import { Component, OnInit } from '@angular/core';
import {Country, GeonamesService} from './geonames.service';
import './rxjs-operators';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css', ],
    providers: [GeonamesService]
})
export class AppComponent implements OnInit {
  metrics = ['ALL', 'areaInSqKm', 'population'];
  maxResults = [5, 10, 15, 20];
  countries:Country[];
  errorMessage:string;
  constructor (private geonames: GeonamesService) {}
  ngOnInit() {
    this.getCountries()
  }

  getCountries() {
    this.geonames.getCountries()
                     .subscribe(
                       countries => this.countries = countries,
                       error =>  this.errorMessage = <any>error);
  }
}
