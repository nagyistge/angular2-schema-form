import {
    ChangeDetectorRef,
    Component,
    OnChanges,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

import {
    Action,
    ActionRegistry,
    FormPropertyFactory,
    FormProperty,
    SchemaPreprocessor,
    ValidatorRegistry,
    Validator
} from './model';

import { SchemaValidatorFactory, ZSchemaValidatorFactory } from './schema-validator.factory';
import { WidgetFactoryService } from './widget-factory.service';

export function useFactory(schemaValidatorFactory, validatorRegistry) {
    return new FormPropertyFactory(schemaValidatorFactory, validatorRegistry);
};

@Component({
    selector: 'sf-form',
    templateUrl: './form.component.html',
    providers: [
        ActionRegistry,
        ValidatorRegistry,
        SchemaPreprocessor,
        WidgetFactoryService,
        {
            provide: SchemaValidatorFactory,
            useClass: ZSchemaValidatorFactory
        },
        {
            provide: FormPropertyFactory,
            useFactory: useFactory,
            deps: [SchemaValidatorFactory, ValidatorRegistry]
        }
    ]
})
export class FormComponent implements OnChanges {

    @Input()
    schema: any;

    @Input()
    model: any;

    @Input()
    actions: { [actionId: string]: Action } = {};

    @Input()
    validators: { [path: string]: Validator } = {};

    @Output()
    onChange = new EventEmitter<{ value: any }>();

    rootProperty: FormProperty;

    constructor(
        private schemaProcessor: SchemaPreprocessor,
        private formPropertyFactory: FormPropertyFactory,
        private actionRegistry: ActionRegistry,
        private validatorRegistry: ValidatorRegistry,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnChanges(changes: any) {
        if (changes.validators) {
            this.setValidators();
        }

        if (changes.actions) {
            this.setActions();
        }

        if (this.schema) {
            if (!this.schema.type) {
                this.schema.type = 'object';
            }

            if (changes.schema) {
                this.schemaProcessor.preprocess(this.schema);
                this.rootProperty = this.formPropertyFactory.createProperty(this.schema);
                this.rootProperty.valueChanges
                    .subscribe(value => { this.onChange.emit({ value: value }); });
            }

            if (changes.model || changes.schema) {
                this.rootProperty.reset(this.model, false);
                this.cdr.detectChanges();
            }
        }
    }

    private setValidators() {
        this.validatorRegistry.clear();
        if (this.validators) {
            Object.keys(this.validators)
                .forEach(id => this.validatorRegistry.register(id, this.validators[id]));
        }
    }

    private setActions() {
        this.actionRegistry.clear();
        if (this.actions) {
            Object.keys(this.actions)
                .forEach(id => this.actionRegistry.register(id, this.actions[id]));
        }
    }

    public reset() {
        this.rootProperty.reset(null, true);
    }
}
