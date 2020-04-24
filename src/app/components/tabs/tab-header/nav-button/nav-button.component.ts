import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ViewChildren, ElementRef, QueryList } from '@angular/core';

import { TabHeaderService } from '../../service/tab-header.service';

@Component({
  selector: 'nav-button',
  templateUrl: './nav-button.component.html',
  styleUrls: ['./nav-button.component.css']
})
export class NavButtonComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('navButton') private navButtons: QueryList<ElementRef>;
  tabHeader: HTMLElement;
  showButton: boolean = false;
  private clickHoldEventDelay: any;
  private clickHoldEventRepeat: any;


  constructor(private ts: TabHeaderService) { }

  ngOnInit(): void {
    this.ts.navigationButtonsState.subscribe(state => {
      this.showButton = state;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setDefaults());

    window.addEventListener('resize', () => this.onResize());
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  private setDefaults() {
    if (this.tabHeader.scrollWidth > this.tabHeader.clientWidth) {
      this.ts.setNavButtonState(true);
    }
  }

  /**
   * Hides or shows the tab headers nav buttons 
   * based on a condition
   */
  private onResize() {
    if (this.tabHeader.scrollWidth > this.tabHeader.clientWidth) {
      this.ts.setNavButtonState(true);
    } else {
      this.ts.setNavButtonState(false);
    }
  }

  /**
   * Move through each tab on nav button click
   */
  onClick(direction: string) {
    const steps: number = direction.toLowerCase() == 'next' ?
      220 : -220;

    this.disableNavButtons();
    this.tabHeader.scrollBy({ left: steps, behavior: 'smooth' });
  }

  /**
   * Automatically scroll through the tabs while
   * click is held down
   */
  onMouseDown(direction: string) {
    const scrollDiff = this.tabHeader.scrollWidth - this.tabHeader.clientWidth;
    const steps = direction.toLowerCase() == 'next' ? 220 : -220;

    this.disableNavButtons();

    this.clickHoldEventDelay = setTimeout(() => {
      this.clickHoldEventRepeat = setInterval(() => {
        const isStart: boolean = this.tabHeader.scrollLeft == 0;
        const isEnd: boolean = Math.ceil(this.tabHeader.scrollLeft) >= scrollDiff;

        if ((direction == 'before' && isStart) || 
          (direction == 'next' && isEnd)) {
          this.clearPersistenClick();
        }

        this.tabHeader.scrollBy({ left: steps, behavior: 'smooth' });
      }, 300);
    }, 400);
  }

  /**
   * Clear all timeouts and intervals
   */
  clearPersistenClick() {
    clearTimeout(this.clickHoldEventDelay);
    clearInterval(this.clickHoldEventRepeat);
  }

  /**
   * Set the navigation button disabled state
   * if the tabheader scroll is 0 (disable left button)
   * & if tab header scroll reaches the end (disable right button)
   */
  disableNavButtons() {
    if (!this.showButton) { return; }

    const navButtons = <HTMLButtonElement[]>this.navButtons.toArray()
      .map(button => button.nativeElement);
    const beforeBtn = navButtons[0];
    const nextBtn = navButtons[1];

    const onScroll = () => {
      const scrollable = this.tabHeader.scrollWidth - this.tabHeader.clientWidth;
      const scrolled = Math.ceil(this.tabHeader.scrollLeft);

      if (scrolled > 0) {
        beforeBtn.disabled = false;
      } else {
        beforeBtn.disabled = true;
      }

      if(scrolled >= scrollable) {
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }
    }
    this.tabHeader.addEventListener('scroll', onScroll); 
  }
}
