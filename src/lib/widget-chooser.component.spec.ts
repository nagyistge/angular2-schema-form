import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WidgetFactory } from './widget-factory';
import { WidgetRegistry } from './widget-registry';

import { WidgetChooserComponent } from './widget-chooser.component';

describe('WidgetChooserComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetChooserComponent],
      providers: [
        WidgetFactory,
        WidgetRegistry,
        ChangeDetectorRef
      ]
    });
  });

  it('should create a widget which contain an instance', () => {
    let fixture = TestBed.createComponent(WidgetChooserComponent);
    let widgetChooserComponent = fixture.debugElement.componentInstance;
    expect(widgetChooserComponent).toBeDefined();
  });

  xit('should put the widget returned by the factory in the DOM', () => {

  });

});
