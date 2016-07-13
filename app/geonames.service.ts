
import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

export class Country {
  continent:string;
  capital:string;
  language:string;
  geonameId:number;
  south:number;
  isoAlpha3:string;
  north:number;
  fipsCode:string;
  population:string;
  east:number;
  isoNumeric:string;
  areaInSqKm:string;
  countryCode:string;
  west:number;
  countryName:string;
  continentName:string;
  currencyCode:string;
}

@Injectable()
export class GeonamesService {
  constructor(private http: Http) {}

  private geonamesApiUrl = 'http://api.geonames.org/countryInfoJSON?formatted=true&username=hydrane';
  private extractData(res: Response) {
    let body = res.json();
    return body.geonames || [];
  }
  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? '${error.status} - ${error.statusText}' : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  getCountries(): Observable<Country[]> {
    return this.http.get(this.geonamesApiUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
}
