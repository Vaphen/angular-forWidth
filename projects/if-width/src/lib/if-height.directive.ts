import { Directive, Input, OnDestroy } from '@angular/core';
import { BaseDirective, Range } from './base.directive';

/**
 * Error that will be thrown if the given parameter is no valid Range
 */
export const ifHeightError = new Error('invalid argument for ifHeight attribute specified');

/**
 * IfHeightDirective is a subclass of the BaseDirective that implements all methods to show/hide
 * elements from the DOM depending on the window's hight.
 */
/** @dynamic */
@Directive({
  selector: '[ifHeight]'
})
export class IfHeightDirective extends BaseDirective implements OnDestroy {
  
  /**
   * The directive's setter
   */
  @Input() set ifHeight(r: string | Range | Range[]) {
    this.setRange(r);
  }

  /**
   * Overwritten function that returns the window hight
   */
  getValueInRange(): number | undefined {
    return this.document.defaultView?.innerHeight;
  }
  
  /**
   * Overwritten function that returns the error that should be thrown if the type validation failed.
   */
  getValidationError(): Error {
    return ifHeightError;
  }
}
