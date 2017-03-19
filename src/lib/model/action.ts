import { FormProperty } from './form-property';

export interface Action {
    (formProperty: FormProperty, parameters: any): void;
}
