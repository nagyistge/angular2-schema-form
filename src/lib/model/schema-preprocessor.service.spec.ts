import { SchemaPreprocessor } from './schema-preprocessor.service';

describe('SchemaPreprocessor', () => {
    let service: SchemaPreprocessor;

    beforeEach(() => {
        service = new SchemaPreprocessor();
    });

    it('should replace order by fieldsets', () => {
        let schema: any = {
            'properties': {
                'name': {},
                'email': {}
            },
            'order': ['name', 'email'],
            'type': 'object'
        };

        service.preprocess(schema);

        expect(schema.fieldsets).toBeDefined();
    });
});
