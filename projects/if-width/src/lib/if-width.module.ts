import { NgModule } from '@angular/core';
import { IfHeightDirective } from './if-height.directive';
import { IfWidthDirective } from './if-width.directive';

@NgModule({
  declarations: [IfWidthDirective, IfHeightDirective],
  imports: [
  ],
  exports: [IfWidthDirective, IfHeightDirective]
})
export class IfWidthModule { }
