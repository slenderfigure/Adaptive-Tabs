import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Tab } from '../tab.model';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  tabs: Tab[];

  /** Tab Component and Tab Header Subject **/
  private activeContentSlideSource = new BehaviorSubject<number>(0);
  activeContentSlide = this.activeContentSlideSource.asObservable();

  /** Tab Component and Tab Indicator Subject **/
  private navigationButtonsStateSource = new BehaviorSubject<boolean>(false);
  navigationButtonsState = this.navigationButtonsStateSource.asObservable();

  /** Tab Header and Tab Indicator Subject **/
  private initIndicatorWidthSource = new BehaviorSubject<number>(0);
  initIndicatorWidth = this.initIndicatorWidthSource.asObservable();


  constructor() { }

  loadTabs(tabs: Tab[]) {
    this.tabs = tabs;
  }

  getHeaders(): string[] {
    return this.tabs.map(tabs => tabs.header);
  }

  changeActiveContentSlide(index: number) {
    this.activeContentSlideSource.next(index);
  }

  setNavigationButtonsState(state: boolean) {
    this.navigationButtonsStateSource.next(state);
  }

  setIndicatorWidth(width: number) {
    this.initIndicatorWidthSource.next(width);
  }
}
