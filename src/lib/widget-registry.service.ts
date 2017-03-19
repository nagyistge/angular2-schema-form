export class WidgetRegistryService {
    private widgets: { [type: string]: any } = {};

    unknownWidget: any;

    hasWidget(type: string) {
        return this.widgets.hasOwnProperty(type);
    }

    register(type: string, widget: any) {
        this.widgets[type] = widget;
    }

    getWidgetType(type: string): any {
        if (this.hasWidget(type)) {
            return this.widgets[type];
        }
        return this.unknownWidget;
    }
}
