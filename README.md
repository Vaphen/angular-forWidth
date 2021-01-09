# forWidth Angular library

ForWidth is a angular directive to remove elements from the DOM at specified screen-size breakpoints. It works similar to CSS media-queries by specifying a minimum and maximum screen width for which an element should be shown.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.6.

## Example

At first, you have to import the module containing the directive:
```
import { ForWidthModule } from 'for-width';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ...
    ForWidthModule,
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Then you can simply specify the range in which the element should be visible.
```
<!-- This will only be visible if the window width is < 700 -->
<p *forWidth="[0, 700]">Only Small Screen</p>

<!-- This will only be visible if the window width is >= 700 -->
<p *forWidth="[700, 'max']">Only Big Screen</p>

<!-- Visible only for window width >= 0 && width < 400 and width >= 800 && width < 1000 >> -->
<p *forWidth="[[0, 400], [800, 1000]]">Multiple ranges</p>
```

You can also use variable bindings:
```
// component.ts
private smallScreen = [0, 720];
// component.html
<p *forWidth="smallScreen">Multiple ranges</p>
```

## Parameters

Following types are allowed
- An array with two elements for a given range [x,y] where x < y. The element will only be visible if element's width is bigger or equal x and smaller than y (e.g. [0, 720])
- An array containing other 2-element arrays to define multiple ranges (e.g. \[[0, 720], [1000, 'max']])
- A string containing the JSON of either type (e.g. "[0, 720]" or "\[[0, 720], [1000, 'max']]")

**An open end screen size can be specified by using the string value 'max' as the second element (e.g. [720, 'max'])**

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

#### If you want to contribute, feel free to PR
