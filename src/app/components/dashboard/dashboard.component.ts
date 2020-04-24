import { Component, OnInit } from '@angular/core';
import { Tab } from '../tabs/tab.model';
import { Observable } from 'rxjs';

import { MyTabsService } from './services/myTabs.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ MyTabsService ]
})
export class DashboardComponent implements OnInit {
  myTabs$: Observable<Tab[]>;

  constructor(private tabService: MyTabsService) { }

  ngOnInit(): void {
    this.myTabs$ = this.tabService.getTabs();
  }

}
