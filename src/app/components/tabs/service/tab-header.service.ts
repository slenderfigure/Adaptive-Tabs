import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Tab } from '../tab.model';

@Injectable()
export class TabHeaderService {
  tabs: Tab[];
  
  /** Tab Component and Tab Header Subject **/
  private activeTabSource = new BehaviorSubject<number>(0);
  activeTab = this.activeTabSource.asObservable();

  /** Tab Component and Tab Indicator Subject **/
  private navButtonStateSource = new BehaviorSubject<boolean>(false);
  navigationButtonsState = this.navButtonStateSource.asObservable();

  /** Tab Header and Tab Indicator Subject **/
  private initIndicatorWidthSource = new BehaviorSubject<number>(0);
  initIndicatorWidth = this.initIndicatorWidthSource.asObservable();


  constructor() { }

  loadTabs(tabs: Tab[]) { this.tabs = tabs; }

  getHeaders(): string[] {
    return this.tabs.map(tabs => tabs.header);
  }

  changeActiveContentSlide(index: number) {
    this.activeTabSource.next(index);
  }

  setNavButtonState(state: boolean) {
    this.navButtonStateSource.next(state);
  }

  setIndicatorWidth(width: number) {
    this.initIndicatorWidthSource.next(width);
  }

}
