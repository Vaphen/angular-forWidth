import { DOCUMENT } from '@angular/common';
import { Inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type MaxRes = 'max';
export type Range = [number, number | MaxRes];

/**
 * Base class for all other resizing directives that hide/show elements in the DOM depending on a given range
 */
export abstract class BaseDirective {
    
    abstract getValueInRange(): number | undefined;
    abstract getValidationError(): Error;

    private range = new Array<Range>();
    private isShown = this.isElemVisible();
    private unsubscribe$ = new Subject<void>();

    /**
     * Constructor
     * @param document the parent document
     * @param templateRef the template reference
     * @param viewContainer the view container
     */
    constructor(
        @Inject(DOCUMENT) protected document: Document,
        protected templateRef: TemplateRef<any>,
        protected viewContainer: ViewContainerRef,
    ) {
        fromEvent(window, 'resize').pipe(takeUntil(this.unsubscribe$)).subscribe(_ => this.modifyVisibility());
    }

     /**
     * Accept different types for setting the range where the element should be shown.
     * Throws a {@link getValidationError} if the parsing failed.
     * @param r the range element
     */
    setRange(r: string | Range | Range[]) {
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
            throw this.getValidationError();
        }

        this.modifyVisibility();
    }


    /**
     * Triggered on element destruction
     */
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * Parse the given string to Range or Range array and throws the error from {@link getValidationError}
     * if it cannot be parsed.
     * @param str the string to parse
     */
    private rangeFromString(str: string): Range | Range[] {
        let res;

        try {
            res = JSON.parse(str);
        } catch (e) {
            throw this.getValidationError();
        }

        if (!this.isArray(res)) {
            throw this.getValidationError();
        }
        const resArr = (res as Array<any>);
        if (resArr.length === 0) {
            throw this.getValidationError();
        }

        // is nested array => array of ranges
        if (!this.isRange(resArr) && !this.isRangeArray(resArr)) {        
            throw this.getValidationError();
        }

        return resArr
    }

    /**
     * Returns true if the given element is a non-empty array containing only ranges
     * @param x the elemen to check
     */
    private isRangeArray(x: any) {
        return this.isNestedArray(x) && x.every((range: any[]) => this.isRange(range) && (range[0] < range[1] || range[1] === 'max'));
    }

    /**
     * Returns true if the given element is a non-empty, nested array
     * @param x the element to check
     */
    private isNestedArray(x: any) {
        return this.isArray(x) && x.length > 0 && this.isArray(x[0]);
    }

    /**
     * Returns true if the given element is of type Range
     * @param x the element to check
     */
    private isRange(x: any): boolean {
        return this.isArray(x) && x.length === 2 && typeof x[0] === 'number' && (x[0] < x[1] || x[1] === 'max') && (typeof x[1] === 'number' || x[1] === 'max');
    }

    /**
     * Returns true only if the given value is an array, else false
     * @param arr the element to check for array type
     */
    private isArray(arr: any): boolean {
        return Object.prototype.toString.call(arr) === '[object Array]'
    }

    /**
     * Returns true if the value of {@link getValueInRange} is in one of the provided ranges.
     */
    private isElemVisible(): boolean {
        const currentWindowValue = this.getValueInRange();
        if (currentWindowValue === undefined) {
        return false;
        }
        return this.range.some((x: Range) => x[0] <= currentWindowValue && (x[1] > currentWindowValue || x[1] === 'max'));
    }

    /**
     * Remove or add the directive's element to the DOM
     */
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