import { DOCUMENT } from '@angular/common';
import { Directive, Inject, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type MaxRes = 'max';
export type Range = [number, number | MaxRes];
export const ifWidthError = new Error('invalid argument for ifWidth attribute specified');

/** @dynamic */
@Directive({
  selector: '[ifWidth]'
})
export class IfWithDirective implements OnDestroy {
  
  private range = new Array<Range>();
  private isShown = this.isElemVisible();
  private unsubscribe$ = new Subject<void>();

  @Input() set ifWidth(r: string | Range | Range[]) {
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
        throw ifWidthError;
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
    let res;

    try {
      res = JSON.parse(str);
    } catch (e) {
      throw ifWidthError;
    }

    if (!this.isArray(res)) {
      throw ifWidthError;
    }
    const resArr = (res as Array<any>);
    if (resArr.length === 0) {
      throw ifWidthError;
    }

    // is nested array => array of ranges
    if (!this.isRange(resArr) && !this.isRangeArray(resArr)) {        
      throw ifWidthError;
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
    return this.isArray(x) && x.length === 2 && typeof x[0] === 'number' && (x[0] < x[1] || x[1] === 'max') && (typeof x[1] === 'number' || x[1] === 'max');
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
