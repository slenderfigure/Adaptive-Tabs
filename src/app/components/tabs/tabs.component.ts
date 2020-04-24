import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Input, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { Tab } from './tab.model';
import { TabHeaderService } from './service/tab-header.service';

@Component({
  selector: 'adison-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  providers: [ TabHeaderService ]
})
export class TabsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('tabs') tabs$: Observable<Tab[]>;
  @ViewChildren('contentSlide') private contentSlides: QueryList<ElementRef>;
  private activeTab: number = 0;
  private subscription: Subscription;
  tabs: Tab[];

  constructor(private ts: TabHeaderService) { }

  ngOnInit(): void {
    if(this.tabs$ instanceof Observable) {
      this.tabs$.subscribe((tabs: Tab[]) => {
        this.tabs = tabs;
        this.ts.loadTabs(this.tabs);
      });
    } else {
      this.tabs = this.tabs$;;
    }
  }

  ngAfterViewInit(): void {
    this.tabs$.subscribe(() => {
      this.setDefaults();
    });

    this.subscription = this.ts.activeTab.subscribe(index => {
      this.contentSlideAnimation(index);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * View defaults after initialization
   */
  private setDefaults() {
    const contentSlides = <HTMLElement[]>this.contentSlides.toArray()
      .map(slide => slide.nativeElement);

    contentSlides[0].style.display = 'block';
  }

  /**
   * Animate each slide content from the right 
   * or left depending on whether the current index 
   * is higher or less than the new one
   */
  private contentSlideAnimation(index: number) {  
    if (index == this.activeTab) { return; }
    
    const contentSlides = <HTMLElement[]>this.contentSlides.toArray()
      .map(slide => slide.nativeElement);
      
    const animation = index > this.activeTab ? 
      'slide_right' : 'slide_left';

    contentSlides.map(slide => slide.style.display = 'none');

    contentSlides[index].style.display = 'block';
    contentSlides[index].style.animation = `${animation} 0.5s ease forwards`;
    this.activeTab = index;
  }

}
