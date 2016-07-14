import { Pipe, PipeTransform } from '@angular/core';
import {Country} from './geonames.service';
@Pipe({name: 'makeChartData'})
export class MakeChartDataPipe implements PipeTransform {
  transform(values:Country[], options:any, field:string): any {
    if ( values == null ) return options;
    var serie:any = { data: [] };
    options.series = [];
    for ( var key in values ) {
      let el = values[key];
      serie.data.push(
        {
          name: el.countryName,
          y: parseInt(el[ field ]),
        }
      );
    }
    options.series.push( serie );
    return options;
  }
}
