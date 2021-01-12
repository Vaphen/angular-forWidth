import { IfWithDirective, ifWidthError, Range } from './if-width.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  template: `
  <p *ifWidth="ifWidth">test</p>
  `
})
export class TestComponent {
  ifWidth: Range | Range[] | string = [0, 'max'];
}

export interface TestData {
  screenWidth: number,
  ifWidth: Range | Range[],
  visibility: boolean,
}

export interface ErrorData {
  ifWidth: any;
}

export interface ResizeData {
  screenWidthInitial: number;
  screenWidthNew: number;
  ifWidth: Range | Range[];
  visibilityInitial: boolean;
  visibilityNew: boolean;
}

const testCases: TestData[] = [
  {
    screenWidth: 0,
    ifWidth: [0, 300],
    visibility: true,
  },
  {
    screenWidth: 500,
    ifWidth: [0, 300],
    visibility: false,
  },
  {
    screenWidth: 300,
    ifWidth: [0, 300],
    visibility: false,
  },
  {
    screenWidth: 299,
    ifWidth: [0, 300],
    visibility: true,
  },
  {
    screenWidth: 500,
    ifWidth: [0, 'max'],
    visibility: true,
  },
  {
    screenWidth: Number.MAX_VALUE,
    ifWidth: [0, 'max'],
    visibility: true,
  },
  {
    screenWidth: 400,
    ifWidth: [[0, 400], [600, 800]],
    visibility: false,
  },
  {
    screenWidth: 600,
    ifWidth: [[0, 400], [600, 800]],
    visibility: true,
  },
  {
    screenWidth: 500,
    ifWidth: [[0, 400], [600, 800]],
    visibility: false,
  },
  {
    screenWidth: 399,
    ifWidth: [[0, 400], [600, 800]],
    visibility: true,
  },
  {
    screenWidth: 1000,
    ifWidth: [[600, 800], [0, 400]],
    visibility: false,
  },
  {
    screenWidth: 700,
    ifWidth: [[600, 800], [0, 400]],
    visibility: true,
  },
]

const errorCases: ErrorData[] = [
  {
    ifWidth: ['a', 300]
  },
  {
    ifWidth: [0, '400']
  },
  {
    ifWidth: ['max', 300],
  },
  {
    ifWidth: [300, 0],
  },
  {
    ifWidth: [],
  },
  {
    ifWidth: 'hello',
  },
  {
    ifWidth: [0, 400, 600],
  },
]

const resizeCases: ResizeData[] = [
  {
    screenWidthInitial: 0,
    screenWidthNew: 1000,
    ifWidth: [0, 500],
    visibilityInitial: true,
    visibilityNew: false,
  },
  {
    screenWidthInitial: 0,
    screenWidthNew: 499,
    ifWidth: [0, 500],
    visibilityInitial: true,
    visibilityNew: true,
  },
  {
    screenWidthInitial: 700,
    screenWidthNew: 300,
    ifWidth: [0, 500],
    visibilityInitial: false,
    visibilityNew: true,
  },
  {
    screenWidthInitial: 0,
    screenWidthNew: 1000,
    ifWidth: [300, 700],
    visibilityInitial: false,
    visibilityNew: false,
  }
]

let fixture: ComponentFixture<TestComponent>;

beforeEach(() => {
  fixture = TestBed.configureTestingModule({
        declarations: [ TestComponent, IfWithDirective ],
      }).createComponent(TestComponent);
  fixture.detectChanges(); // initial binding
});

describe('IfWidthDirective valid attribute values', () => {
  for (const testCase of testCases) {
    for (let i = 0; i < 2; i++) {
      it(`should should test the argument ${JSON.stringify(testCase.ifWidth)} as a ${i === 0 ? 'range' : 'string'} value for screen width ${testCase.screenWidth}`, () => {
        Object.assign(window, {innerWidth: testCase.screenWidth});

        fixture.componentInstance.ifWidth = i === 0 ? testCase.ifWidth : JSON.stringify(testCase.ifWidth);
        fixture.detectChanges();

        expect(!!(fixture.nativeElement as HTMLElement).querySelector('p')).toBe(testCase.visibility);
      });
    }
  }
});

describe('IfWidthDirective invalid attribute values', () => {
  for (const errorCase of errorCases) {
    for (let i = 0; i < 2; i++) {
      it(`should test the argument ${JSON.stringify(errorCase.ifWidth)} as a ${i === 0 ? 'range' : 'string'} value for screen width 300`, () => {
        Object.assign(window, {innerWidth: 300});
        fixture.componentInstance.ifWidth = i === 0 ? errorCase.ifWidth : JSON.stringify(errorCase.ifWidth);

        expect(() => fixture.detectChanges()).toThrow(ifWidthError);
      });
    }
  }
});

describe('IfWidthDirective after resizing', () => {
  for (const resizeCase of resizeCases) {
    it(`should test the argument ${JSON.stringify(resizeCase.ifWidth)} for screen ${resizeCase.screenWidthInitial} -> ${resizeCase.screenWidthNew}`, () => {
      
      Object.assign(window, {innerWidth: resizeCase.screenWidthInitial});
      fixture.componentInstance.ifWidth = resizeCase.ifWidth;
      fixture.detectChanges();

      expect(!!(fixture.nativeElement as HTMLElement).querySelector('p')).toBe(resizeCase.visibilityInitial);
      
      Object.assign(window, {innerWidth: resizeCase.screenWidthNew});
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();

      expect(!!(fixture.nativeElement as HTMLElement).querySelector('p')).toBe(resizeCase.visibilityNew);
    });
  }
});