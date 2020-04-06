import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild, QueryList, ElementRef } from '@angular/core';

import { TabService } from '../../service/tab.service';

@Component({
  selector: 'tab-indicator',
  templateUrl: './tab-indicator.component.html',
  styleUrls: ['./tab-indicator.component.css']
})
export class TabIndicatorComponent implements OnInit, AfterViewInit {
  @ViewChild('tabIndicator') tabIndicator: ElementRef;
  activeTab: number = 0;
  showAlternate: boolean;


  constructor(private tabService: TabService) { }

  ngOnInit(): void {
    this.tabService.navigationButtonsState.subscribe(state => {
      this.showAlternate = state;
    });

    this.tabService.activeContentSlide.subscribe(index => {
      this.activeTab = index;
    })
  }

  ngAfterViewInit(): void {
    this.tabService.initIndicatorWidth.subscribe(width => {
      this.tabIndicator.nativeElement.style.width = `${width}px`;
    });
  }

  activeIndicatorAnimation(ele: QueryList<ElementRef>) {
    const stripTab = <HTMLLIElement[]>ele.toArray()
      .map(tab => tab.nativeElement);
    const indicator = <HTMLElement>this.tabIndicator.nativeElement;
    const width = stripTab[this.activeTab].offsetWidth;

    const travel = stripTab.map((header, i) => {
      if (i < this.activeTab) { return header.clientWidth; }
      else { return 0; }
    }).reduce((a, b) => a + b, 0);
    
    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${travel}px)`;
  }
}
