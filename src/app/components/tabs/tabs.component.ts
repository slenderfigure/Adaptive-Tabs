import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Input, ViewChildren, ElementRef, QueryList } from '@angular/core';

import { Tab } from './tab.model';

import { TabService } from './service/tab.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'adison-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() tabs: Tab[];
  @ViewChildren('contentSlide') private contentSlides: QueryList<ElementRef>;
  private activeContentSlide: number = 0;
  private tabServiceSub: Subscription;


  constructor(private tabService: TabService) { }

  ngOnInit(): void {
    this.tabService.loadTabs(this.tabs);
  }

  ngAfterViewInit(): void {
    this.setDefaults();
    
    this.tabServiceSub = this.tabService.activeContentSlide
    .subscribe(index => {
      this.contentSlideAnimation(index);
    });
  }

  ngOnDestroy(): void {
    this.tabServiceSub.unsubscribe();
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
    if (index == this.activeContentSlide) { return; }
    
    const contentSlides = <HTMLElement[]>this.contentSlides.toArray()
      .map(slide => slide.nativeElement);
      
    const animation = index > this.activeContentSlide ? 
      'slide_right' : 'slide_left';

    contentSlides.map(slide => slide.style.display = 'none');

    contentSlides[index].style.display = 'block';
    contentSlides[index].style.animation = `${animation} 0.5s ease forwards`;
    this.activeContentSlide = index;
  }

}
