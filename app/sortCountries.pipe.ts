import { Pipe, PipeTransform } from '@angular/core';
import {Country} from './geonames.service';
@Pipe({name: 'sortCountries'})
export class SortCountriesPipe implements PipeTransform {
  /* SORTING */
  private sortStrings(a:string,b:string):number {
    if ( a == b ) {
      return 0;
    }
    else if ( a > b ) {
      return 1;
    }
    return -1;
  }
  private sortNumbers(a:number, b:number):number {
    if ( a == b ) {
      return 0;
    }
    else if ( a > b ) {
      return 1;
    }
    return -1;
  }
  toggle = 1;
  private sortByContinentName(a:Country,b:Country):number {
    return this.toggle * this.sortStrings(a.continentName, b.continentName);
  }
  private sortByCountryName(a:Country,b:Country):number {
    return this.toggle * this.sortStrings(a.countryName, b.countryName);
  }
  private sortByArea(a:Country,b:Country):number {
    return this.toggle * this.sortNumbers(parseInt(a.areaInSqKm), parseInt(b.areaInSqKm));
  }
  private sortByPopulation(a:Country,b:Country):number {
    return this.toggle * this.sortNumbers(parseInt(a.population), parseInt(b.population));
  }
  transform(value: Country[], field:string, sign:number): Country[] {
    if ( value == null ) return [];
    if ( sign < 0 ) {
      this.toggle = -1;
    }
    else {
      this.toggle = 1;
    }
    if ( field == 'continentName' ) {
      value.sort( (a,b) => this.sortByContinentName(a,b) );
    }
    else if ( field == 'countryName' ) {
      value.sort( (a,b) => this.sortByContinentName(a,b) );
    }
    else if ( field == 'areaInSqKm' ) {
      value.sort( (a,b) => this.sortByArea(a,b) );
    }
    else {
      value.sort( (a,b) => this.sortByPopulation(a,b) );
    }
    return value;
  }
}
