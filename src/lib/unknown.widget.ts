import { Component } from '@angular/core';

@Component({
    selector: 'sf-unknown-field',
    template: `
    <p>Cannot find valid type for {{name}}
  `
})
export class UnknownWidget { }
