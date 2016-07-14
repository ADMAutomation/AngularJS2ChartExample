import './rxjs-operators';
import { Component, OnInit } from '@angular/core';
import {Country, GeonamesService} from './geonames.service';
import {ContinentsFromCountriesPipe} from './continentsFromCountries.pipe';
import {SortCountriesByPopulationPipe} from './sortCountriesByPopulation.pipe';
import {SortCountriesByAreaPipe} from './sortCountriesByArea.pipe';
import {MakeChartDataPipe} from './makeChartData.pipe';
import { CHART_DIRECTIVES } from 'angular2-highcharts';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css', ],
    providers: [GeonamesService],
    pipes: [ContinentsFromCountriesPipe, SortCountriesByAreaPipe, SortCountriesByPopulationPipe, MakeChartDataPipe],
    directives: [CHART_DIRECTIVES]
})
export class AppComponent implements OnInit {
  metrics = ['ALL', 'areaInSqKm', 'population'];
  maxResults = [5, 10, 15, 20];
  selectedContinent = 'ALL';
  selectedMetrics = 'ALL';
  selectedMaxResults = 5;
  countries:Country[];
  errorMessage:string;
  resultCountries:Country[];
  showResults = false;
  areaChartOptions = {
    chart: { type: 'pie' },
    title: { text: 'most extensive nations' },
    series: [ { data: [1,2,3] } ],
    optionsAsync: true,
  };
  get areaChartData() {
    let order = new SortCountriesByAreaPipe();
    var data = order.transform(this.resultCountries, this.selectedMaxResults);
    let maker = new MakeChartDataPipe();
    return maker.transform(data, this.areaChartOptions, 'areaInSqKm');
  }
  populationChartOptions = {
    chart: { type: 'pie' },
    title: { text: 'most populous nations' },
    series: [ { data: [{ name: 'ugo', y:9 },2,3] } ]
  };
  get populationChartData() {
    let order = new SortCountriesByPopulationPipe();
    var data = order.transform(this.resultCountries, this.selectedMaxResults);
    let maker = new MakeChartDataPipe();
    return maker.transform(data, this.populationChartOptions, 'population');
  }
  constructor (private geonames: GeonamesService) {}
  ngOnInit() {
    /* We need geonames data before Go Action. We need continents.
    From documentation, on 'Go' action:
    - Fetch data from internet. For every data point, relevant
    attributes are continentName, countryName, areaInSqKm and population
    */
    this.getCountries();
  }
  areaChartObject : any;
  saveAreaChartObject(chartInstance:any) {
    this.areaChartObject = chartInstance;
    //console.log(chartInstance);
  }
  populationChartObject : any;
  savePopulationChartObject(chartInstance:any) {
    this.populationChartObject = chartInstance;
    //console.log(chartInstance);
  }
  getCountries() {
    this.geonames.getCountries()
                     .subscribe(
                       countries => this.countries = countries,
                       error =>  this.errorMessage = <any>error);
  }
  get displayAreaData():boolean {
    if ( this.selectedMetrics == 'ALL' || this.selectedMetrics == 'areaInSqKm' ) {
      return true;
    }
    return false;
  }
  get displayPopulationData():boolean {
    if ( this.selectedMetrics == 'ALL' || this.selectedMetrics == 'population' ) {
      return true;
    }
    return false;
  }
  updateMetrics(newValue:any) {
    this.selectedMetrics = newValue;
    this.updateResults();
  }
  updateContinent(newValue:any){
    this.selectedContinent = newValue;
    this.updateResults();
  }
  updateMaxResults(newValue:any){
    this.selectedMaxResults = newValue;
    this.updateResults();
  }
  orderByChars(a:Country, b:Country):number {
    //console.log(a.countryName, b.countryName);
    if(a.countryName > b.countryName) {
      //console.log(1);
      return 1;
    }
    else if(a.countryName == b.countryName) {
      //console.log(0);
      return 0;
    }
    else {
      //console.log(-1);
      return -1;
    }
  }
  updateResults(event?:any) {
    this.resultCountries = [];
    for ( var key in this.countries ) {
      let el = this.countries[key];
      var insert = true;
      if ( this.selectedContinent != 'ALL' && el.continent != this.selectedContinent ) {
        insert = false;
      }
      if ( insert ) {
        this.resultCountries.push(el);
      }
    }
    if (this.areaChartObject) {
      let newAreaData = this.areaChartData;
      let serieRef = this.areaChartObject.series[0];
      serieRef.setData(newAreaData.series[0].data);
    }
    if (this.populationChartObject) {
      let newPopulationData = this.populationChartData;
      let serieRef = this.populationChartObject.series[0];
      serieRef.setData(newPopulationData.series[0].data);
    }
    console.log('B', this.resultCountries[0]);
    this.resultCountries = this.resultCountries.sort( (a,b) => this.orderByChars(a,b));
   console.log('A',this.resultCountries[0]);
  }
  goAction(event:any) {
    this.updateResults();
    this.showResults = true;
  }
}
/* CHART GITHUB COMMENT:
Why don't my series, title, axes and etc redraw after I update initial options ?

Because angular-highcharts is just a thin wrapper of the Highcharts library and doesn't bind to initial options. I understand that you expect more angular-way behaviour like data binding with appropriate redrawing. But it is barely possible to implement it without redundant complications and performance decrease because almost all options can be dynamic. So my idea was to avoid any additional logic more than just a sugar (like events for series and options). In the other hand Highcharts has great API for dynamic manipulations with chart and angular-highcharts provides you access to the original chart object.
 */
