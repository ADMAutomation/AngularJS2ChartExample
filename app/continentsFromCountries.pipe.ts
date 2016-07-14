import { Pipe, PipeTransform } from '@angular/core';
import {Country} from './geonames.service';
@Pipe({name: 'continentsFromCountries'})
export class ContinentsFromCountriesPipe implements PipeTransform {
  transform(value: Country[]): string[] {
    var continents:string[] = [];
    var results:string[] = ['ALL'];
    for ( var key in value ) {
      var el = value[key];
      if ( continents.indexOf( el.continent ) < 0 ) {
        continents.push(el.continent);
      }
      continents.sort();
    }
    return continents;
  }
}
