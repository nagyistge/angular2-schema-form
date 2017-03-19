import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';

import { FormComponent } from './form.component';
import { FormElementComponent } from './form-element.component';
import { WidgetChooserComponent } from './widget-chooser.component';
import {
    ArrayWidget,
    ObjectWidget,
    CheckboxWidget,
    FileWidget,
    IntegerWidget,
    TextAreaWidget,
    RadioWidget,
    RangeWidget,
    SelectWidget,
    StringWidget
} from './widgets';
import {
    UnknownWidget
} from './unknown.widget';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        FormElementComponent,
        FormComponent,
        WidgetChooserComponent,
        UnknownWidget,
        ArrayWidget,
        ObjectWidget,
        CheckboxWidget,
        FileWidget,
        IntegerWidget,
        TextAreaWidget,
        RadioWidget,
        RangeWidget,
        SelectWidget,
        StringWidget,
    ],
    entryComponents: [
        FormElementComponent,
        FormComponent,
        WidgetChooserComponent,
        ArrayWidget,
        ObjectWidget,
        CheckboxWidget,
        FileWidget,
        IntegerWidget,
        TextAreaWidget,
        RadioWidget,
        RangeWidget,
        SelectWidget,
        StringWidget,
    ],
    exports: [
        FormComponent,
        FormElementComponent,
        WidgetChooserComponent,
        ArrayWidget,
        ObjectWidget,
        CheckboxWidget,
        FileWidget,
        IntegerWidget,
        TextAreaWidget,
        RadioWidget,
        RangeWidget,
        SelectWidget,
        StringWidget
    ]
})
export class SchemaFormModule { }
