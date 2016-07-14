import './rxjs-operators';
import { Component, OnInit } from '@angular/core';
import {Country, GeonamesService} from './geonames.service';
import {ContinentsFromCountriesPipe} from './continentsFromCountries.pipe';
import {SortCountriesByPopulationPipe} from './sortCountriesByPopulation.pipe';
import {SortCountriesByAreaPipe} from './sortCountriesByArea.pipe';
import {SortCountriesPipe} from './sortCountries.pipe';
import {MakeChartDataPipe} from './makeChartData.pipe';
import { CHART_DIRECTIVES } from 'angular2-highcharts';
import { InfiniteScroll } from 'angular2-infinite-scroll';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css', ],
    providers: [GeonamesService],
    pipes: [ContinentsFromCountriesPipe, SortCountriesPipe, SortCountriesByAreaPipe, SortCountriesByPopulationPipe, MakeChartDataPipe],
    directives: [CHART_DIRECTIVES, InfiniteScroll]
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
  get areaSum():number {
    var tot = 0;
    for (var key in this.resultCountries) {
      tot += parseInt(this.resultCountries[key].areaInSqKm);
    }
    return tot;
  }
  get populationSum():number {
    var tot = 0;
    for (var key in this.resultCountries) {
      tot += parseInt(this.resultCountries[key].population);
    }
    return tot;
  }
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
  }
  goAction(event:any) {
    this.updateResults();
    this.showResults = true;
  }
  private sortByContinentNameToggle = 1;
  private sortByCountryNameToggle = 1;
  private sortByAreaToggle = 1;
  private sortByPopulationToggle = 1;
  sortField = 'countryName';
  sortToggle = 1;
  doSortByContinentName(){
    this.sortField = 'continentName';
    this.sortToggle = this.sortByContinentNameToggle;
    this.sortByContinentNameToggle = -1 * this.sortByContinentNameToggle;
  }
  doSortByCountryName(){
    this.sortField = 'countryName';
    this.sortToggle = this.sortByCountryNameToggle;
    this.sortByCountryNameToggle = -1 * this.sortByCountryNameToggle;
  }
  doSortByArea(){
    this.sortField = 'areaInSqKm';
    this.sortToggle = this.sortByAreaToggle;
    this.sortByAreaToggle = -1 * this.sortByAreaToggle;
  }
  doSortByPopulation(){
    this.sortField = 'population';
    this.sortToggle = this.sortByPopulationToggle;
    this.sortByPopulationToggle = -1 * this.sortByPopulationToggle;
  }
  scrollResultLimit=15;
  onScroll(){
    if ( this.scrollResultLimit < this.resultCountries.length )
      this.scrollResultLimit += 5;
  }
  get resultCountriesSubset():Country[] {
    let order = new SortCountriesPipe();
    let data = order.transform(this.resultCountries, this.sortField, this.sortToggle);
    return data.slice(0,this.scrollResultLimit);
  }
}
/* CHART GITHUB COMMENT:
Why don't my series, title, axes and etc redraw after I update initial options ?

Because angular-highcharts is just a thin wrapper of the Highcharts library and doesn't bind to initial options. I understand that you expect more angular-way behaviour like data binding with appropriate redrawing. But it is barely possible to implement it without redundant complications and performance decrease because almost all options can be dynamic. So my idea was to avoid any additional logic more than just a sugar (like events for series and options). In the other hand Highcharts has great API for dynamic manipulations with chart and angular-highcharts provides you access to the original chart object.
 */
