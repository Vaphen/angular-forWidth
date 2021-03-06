import { IfWidthDirective, ifWidthError } from './if-width.directive';
import { Range } from './base.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { testCases, errorCases, resizeCases } from './testdata.spec';

@Component({
  template: `
  <p *ifWidth="ifWidth">test</p>
  `
})
export class TestComponent {
  ifWidth: Range | Range[] | string = [0, 'max'];
}

describe('IfWidthDirective test valid and invalid values', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
          declarations: [ TestComponent, IfWidthDirective ],
        }).createComponent(TestComponent);
    fixture.detectChanges(); // initial binding
  });

  for (const testCase of testCases) {
    for (let i = 0; i < 2; i++) {
      it(`should should test the argument ${JSON.stringify(testCase.ifValue)} as a ${i === 0 ? 'range' : 'string'} value for screen width ${testCase.screenSize}`, () => {
        Object.assign(window, {innerWidth: testCase.screenSize});

        fixture.componentInstance.ifWidth = i === 0 ? testCase.ifValue : JSON.stringify(testCase.ifValue);
        fixture.detectChanges();

        expect(!!(fixture.nativeElement as HTMLElement).querySelector('p')).toBe(testCase.visibility);
      });
    }
  }

  for (const errorCase of errorCases) {
    for (let i = 0; i < 2; i++) {
      it(`should test the argument ${JSON.stringify(errorCase.ifValue)} as a ${i === 0 ? 'range' : 'string'} value for screen width 300`, () => {
        Object.assign(window, {innerWidth: 300});
        fixture.componentInstance.ifWidth = i === 0 ? errorCase.ifValue : JSON.stringify(errorCase.ifValue);

        expect(() => fixture.detectChanges()).toThrow(ifWidthError);
      });
    }
  }

  for (const resizeCase of resizeCases) {
    it(`should test the argument ${JSON.stringify(resizeCase.ifValue)} for screen ${resizeCase.screenSizeInitial} -> ${resizeCase.screenSizeNew}`, () => {
      
      Object.assign(window, {innerWidth: resizeCase.screenSizeInitial});
      fixture.componentInstance.ifWidth = resizeCase.ifValue;
      fixture.detectChanges();

      expect(!!(fixture.nativeElement as HTMLElement).querySelector('p')).toBe(resizeCase.visibilityInitial);
      
      Object.assign(window, {innerWidth: resizeCase.screenSizeNew});
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();

      expect(!!(fixture.nativeElement as HTMLElement).querySelector('p')).toBe(resizeCase.visibilityNew);
    });
  }
});