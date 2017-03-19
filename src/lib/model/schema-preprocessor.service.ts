function formatMessage(message, path) {
    return `Parsing error on ${ path }: ${ message }`;
}

function schemaError(message, path): void {
    let mesg = formatMessage(message, path);
    throw new Error(mesg);
}

function schemaWarning(message, path): void {
    let mesg = formatMessage(message, path);
    throw new Error(mesg);
}

export class SchemaPreprocessor {
    preprocess(jsonSchema: any, path = '/'): any {
        jsonSchema = jsonSchema || {};

        if (jsonSchema.type === 'object') {
            this.checkProperties(jsonSchema, path);
            this.checkAndCreateFieldsets(jsonSchema, path);
            this.normalizeRequired(jsonSchema);
        } else if (jsonSchema.type === 'array') {
            this.checkItems(jsonSchema, path);
        }

        this.normalizeWidget(jsonSchema);
        this.recursiveCheck(jsonSchema, path);
    }

    private checkProperties(jsonSchema, path: string) {
        if (!jsonSchema.properties) {
            jsonSchema.properties = {};
            schemaWarning('Provided json schema does not contain a \'properties\' entry. Output schema will be empty', path);
        }
    }

    private checkAndCreateFieldsets(jsonSchema: any, path: string) {
        if (!jsonSchema.fieldsets) {
            if (jsonSchema.order) {
                this.replaceOrderByFieldsets(jsonSchema);
            } else {
                this.createFieldsets(jsonSchema);
            }
        }
        this.checkFieldsUsage(jsonSchema, path);
    }

    private checkFieldsUsage(jsonSchema, path: string) {
        let fieldsId = Object.keys(jsonSchema.properties);

        let usedFields = {};
        for (let fieldset of jsonSchema.fieldsets) {
            for (let fieldId of fieldset.fields) {
                if (!usedFields[fieldId]) {
                    usedFields[fieldId] = [];
                }
                usedFields[fieldId].push(fieldset.id);
            }
        }

        for (let fieldId of fieldsId) {
            if (usedFields.hasOwnProperty(fieldId)) {
                if (usedFields[fieldId].length > 1) {
                    schemaError(`${ fieldId } is referenced by more than one fieldset: ${ usedFields[fieldId] }`, path);
                }
                delete usedFields[fieldId];
            } else if (jsonSchema.required.indexOf(fieldId) > -1) {
                schemaError(`${ fieldId } is a required field but it is not referenced as part of a 'order' or a 'fieldset' property`, path);
            } else {
                delete jsonSchema[fieldId];
                schemaWarning(`Removing unreferenced field ${ fieldId }`, path);
            }
        }

        for (let remainingfieldsId in usedFields) {
            if (usedFields.hasOwnProperty(remainingfieldsId)) {
                schemaWarning(`Referencing non-existent field ${ remainingfieldsId } in one or more fieldsets`, path);
            }
        }
    }

    private createFieldsets(jsonSchema) {
        jsonSchema.order = Object.keys(jsonSchema.properties);
        this.replaceOrderByFieldsets(jsonSchema);
    }

    private replaceOrderByFieldsets(jsonSchema) {
        jsonSchema.fieldsets = [{
            id: 'fieldset-default',
            title: jsonSchema.description || '',
            fields: jsonSchema.order
        }];
        delete jsonSchema.order;
    }

    private normalizeWidget(fieldSchema: any) {
        fieldSchema.widget = {
            id: fieldSchema.widget || fieldSchema.type
        };
    }

    private normalizeRequired(jsonSchema) {
        if (jsonSchema.type === 'object' && !jsonSchema.required) {
            jsonSchema.required = Object.keys(jsonSchema.properties);
        }
    }

    private checkItems(jsonSchema: any, path: string) {
        if (!jsonSchema.items) {
            schemaError('No \'items\' property in array', path);
        }
    }

    private recursiveCheck(jsonSchema: any, path: string) {
        if (jsonSchema.type === 'object') {
            Object.keys(jsonSchema.properties)
                .forEach(prop => this.preprocess(jsonSchema.properties[prop], `${ path }${ prop }/`));
        } else if (jsonSchema.type === 'array') {
            this.preprocess(jsonSchema.items, path + '*/');
        }
    }
}

