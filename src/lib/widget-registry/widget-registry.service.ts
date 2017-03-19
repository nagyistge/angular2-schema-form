export class WidgetRegistryService {
    private widgets: Map<string, any>;

    unknownWidget: any;

    constructor() {
        this.widgets = new Map<string, any>();
    }

    hasWidget(type: string) {
        return this.widgets.has(type);
    }

    register(type: string, widget: any) {
        this.widgets.set(type, widget);
    }

    getWidget(type: string): any {
        return this.widgets.has(type)
            ? this.widgets.get(type)
            : this.unknownWidget;
    }
}
