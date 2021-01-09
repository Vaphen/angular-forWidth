import { DOCUMENT } from '@angular/common';
import { Directive, Inject, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type MaxRes = 'max';
export type Range = [number, number | MaxRes];

/** @dynamic */
@Directive({
  selector: '[forWidth]'
})
export class ForWidthDirective implements OnDestroy {
  
  private range = new Array<Range>();
  private isShown = this.isElemVisible();
  private unsubscribe$ = new Subject<void>();

  @Input() set forWidth(r: string | Range | Range[]) {
    switch (true) {
      case typeof r === 'string':
        const range = this.rangeFromString((r as string).replace(/'/g, '"'));
        this.range = this.isRange(range) ? [range as Range] : range as Range[];
        break;
      case this.isRange(r):
        this.range = [r as Range];
        break;
      case this.isRangeArray(r):
        this.range = r as Range[];
        break;
      default:
        throw new Error('Provided resolution is invalid.')
    }

    this.modifyVisibility();
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {
    fromEvent(window, 'resize').pipe(takeUntil(this.unsubscribe$)).subscribe(_ => this.modifyVisibility());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private rangeFromString(str: string): Range | Range[] {
    const res = JSON.parse(str);
    if (!this.isArray(res)) {
      throw new Error('Provided range of resolutions must be an array.');
    }
    const resArr = (res as Array<any>);
    if (resArr.length === 0) {
      throw new Error('At least one resolution range must be provided (e.g. [0, 500], [500, \'max\']');
    }

    // is nested array => array of ranges
    if (!this.isRange(resArr) && !this.isRangeArray(resArr)) {        
      throw new Error('Provided range array must be either something like [0, 500] or [[0, 500], [500, 1000], [1000, \'max\']]');
    }

    return resArr
  }

  private isRangeArray(x: any) {
    return this.isNestedArray(x) && x.every((range: any[]) => this.isRange(range) && (range[0] < range[1] || range[1] === 'max'));
  }

  private isNestedArray(x: any) {
    return this.isArray(x) && x.length > 0 && this.isArray(x[0]);
  }

  private isRange(x: any): boolean {
    return this.isArray(x) && x.length === 2 && typeof x[0] === 'number' && (typeof x[1] === 'number' || x[1] === 'max');
  }

  private isArray(arr: any): boolean {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }

  private getWindowWidth(): number | undefined {
    return this.document.defaultView?.innerWidth;
  }

  private isElemVisible(): boolean {
    const currentWindowWidth = this.getWindowWidth();
    if (currentWindowWidth === undefined) {
      return false;
    }
    return this.range.some(x => x[0] <= currentWindowWidth && (x[1] > currentWindowWidth || x[1] === 'max'));
  }

  private modifyVisibility() {
    if (this.isElemVisible() && !this.isShown) {
      this.isShown = true;
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (!this.isElemVisible() && this.isShown) {
      this.isShown = false;
      this.viewContainer.clear();
    }
  }

}
