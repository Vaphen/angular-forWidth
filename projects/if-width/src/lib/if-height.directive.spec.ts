import { Range } from './base.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testCases, errorCases, resizeCases } from './testdata.spec';
import { IfHeightDirective, ifHeightError } from './if-height.directive';

@Component({
  template: `
  <p *ifHeight="ifHeight">test</p>
  `
})
export class TestComponent {
  ifHeight: Range | Range[] | string = [0, 'max'];
}

describe('IfHeightDirective test valid and invalid values', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
          declarations: [ TestComponent, IfHeightDirective ],
        }).createComponent(TestComponent);
    fixture.detectChanges(); // initial binding
  });

  for (const testCase of testCases) {
    for (let i = 0; i < 2; i++) {
      it(`should should test the argument ${JSON.stringify(testCase.ifValue)} as a ${i === 0 ? 'range' : 'string'} value for screen height ${testCase.screenSize}`, () => {
        Object.assign(window, {innerHeight: testCase.screenSize});

        fixture.componentInstance.ifHeight = i === 0 ? testCase.ifValue : JSON.stringify(testCase.ifValue);
        fixture.detectChanges();

        expect(!!(fixture.nativeElement as HTMLElement).querySelector('p')).toBe(testCase.visibility);
      });
    }
  }

  for (const errorCase of errorCases) {
    for (let i = 0; i < 2; i++) {
      it(`should test the argument ${JSON.stringify(errorCase.ifValue)} as a ${i === 0 ? 'range' : 'string'} value for screen height 300`, () => {
        Object.assign(window, {innerHeight: 300});
        fixture.componentInstance.ifHeight = i === 0 ? errorCase.ifValue : JSON.stringify(errorCase.ifValue);

        expect(() => fixture.detectChanges()).toThrow(ifHeightError);
      });
    }
  }

  for (const resizeCase of resizeCases) {
    it(`should test the argument ${JSON.stringify(resizeCase.ifValue)} for screen ${resizeCase.screenSizeInitial} -> ${resizeCase.screenSizeNew}`, () => {
      
      Object.assign(window, {innerHeight: resizeCase.screenSizeInitial});
      fixture.componentInstance.ifHeight = resizeCase.ifValue;
      fixture.detectChanges();

      expect(!!(fixture.nativeElement as HTMLElement).querySelector('p')).toBe(resizeCase.visibilityInitial);
      
      Object.assign(window, {innerHeight: resizeCase.screenSizeNew});
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();

      expect(!!(fixture.nativeElement as HTMLElement).querySelector('p')).toBe(resizeCase.visibilityNew);
    });
  }
});