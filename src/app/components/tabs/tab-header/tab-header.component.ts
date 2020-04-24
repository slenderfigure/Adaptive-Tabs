import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';

import { NavButtonComponent } from './nav-button/nav-button.component';
import { TabIndicatorComponent } from './tab-indicator/tab-indicator.component';
import { TabHeaderService } from '../service/tab-header.service';

import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: ['./tab-header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TabHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  headers: string[];
  @ViewChild('tabHeader') tabHeaders: ElementRef;
  @ViewChildren('tabStrip') tabStrip: QueryList<ElementRef>;
  @ViewChildren('navButton') navButtons: QueryList<ElementRef>;
  @ViewChild(TabIndicatorComponent) tabIndicator: TabIndicatorComponent;
  @ViewChild(NavButtonComponent) navButtonComponent: NavButtonComponent;
  activeTabHeader: number = 0;
  activeTab: number = 0;
  showNavButtons: boolean = false;

  
  constructor(private ts: TabHeaderService) { }

  ngOnInit(): void {
    this.headers = this.ts.getHeaders();

    this.ts.navigationButtonsState.subscribe(state => {
      this.showNavButtons = state;
    });
  }

  ngAfterViewInit(): void {
    this.setDefaults();
    window.addEventListener('click', e => this.onTabHeaderBlur(e));
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', this.onTabHeaderBlur);
  }

  /**
   * View defaults after initialization
   */
  private setDefaults() {
    // activeTabIndicator Initial Width
    const tabHeader = <HTMLElement>this.tabHeaders.nativeElement;
    const tabStrip = <HTMLLIElement[]>this.tabStrip.toArray()
      .map(tab => tab.nativeElement);

    this.ts.setIndicatorWidth(tabStrip[this.activeTab].offsetWidth);
    this.navButtonComponent.tabHeader = tabHeader;
  }

  /**
   * Switch slides on tab header click
   */
  onClick(index: number) {
    this.activeTabHeader = index;
    this.tabHeaderScrollIntoView(index);
    this.ts.changeActiveContentSlide(index);
    this.tabIndicator.activeIndicatorAnimation(this.tabStrip);
  }

  /**
   * Tab headers keydown event to navigate
   * through them using the Arrow Keys and Enter
   */
  onKeyDown(key: KeyboardEvent) {
    key.preventDefault();

    const tabStrip = <HTMLLIElement[]>this.tabStrip.toArray()
      .map(tab => tab.nativeElement);
    const length = tabStrip.length - 1;

    switch (key.key) {
      case 'ArrowRight':
        this.activeTabHeader = this.activeTabHeader < length ?
          this.activeTabHeader += 1 : 0;
        break;
      
      case 'ArrowLeft':
        this.activeTabHeader = this.activeTabHeader > 0 ?
          this.activeTabHeader -= 1 : length;
        break;

      case 'Enter':
        this.onClick(this.activeTabHeader);
        break;
    
      default:
        return;
    }
    this.resetTabHeaderState();
    this.tabHeaderScrollIntoView(this.activeTabHeader);
    tabStrip[this.activeTabHeader].classList.add('focused-tab');
  }

  /**
   * Scrolls the clicked tab header into view
   */
  private tabHeaderScrollIntoView(index: number) {
    const tabStrip = <HTMLLIElement[]>this.tabStrip.toArray()
      .map(tab => tab.nativeElement);

    this.navButtonComponent.disableNavButtons();

    if (this.showNavButtons) {
      tabStrip[index].scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: 'smooth'
      });
    }
  }

  /**
   * Deselect the currently focused tab header 
   * if clicked outside
   */
  private onTabHeaderBlur(ele: any) {
    const target = this.tabStrip.toArray()
      .map(tab => tab.nativeElement).indexOf(ele.target);
    
    if (target < 0) { this.resetTabHeaderState(true); } 
  }

  /**Removes the focused class and resets
   * the active tab header index to 0 if set
   * to true
   */
  resetTabHeaderState(resetIndex: boolean = false) {
    const tabStrip = <HTMLLIElement[]>this.tabStrip.toArray()
      .map(tab => tab.nativeElement);

    tabStrip.map(tab => tab.classList.remove('focused-tab'));
    
    if (resetIndex) { this.activeTabHeader = 0; }
  }
  
}
