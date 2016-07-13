import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css', ]
})
export class AppComponent {
  metrics = ['ALL', 'areaInSqKm', 'population'],
  maxResults = [5, 10, 15, 20]
}
