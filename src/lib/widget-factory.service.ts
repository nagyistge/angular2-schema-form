import {
    ViewContainerRef,
    ComponentRef,
    ComponentFactoryResolver,
    Injectable
} from '@angular/core';

import { WidgetRegistryService } from './widget-registry.service';

@Injectable()
export class WidgetFactoryService {
    constructor(
        private registry: WidgetRegistryService,
        private resolver: ComponentFactoryResolver
    ) {
    }

    createWidget(container: ViewContainerRef, type: string): ComponentRef<any> {
        let componentClass = this.registry.getWidgetType(type);

        let componentFactory = this.resolver.resolveComponentFactory(componentClass);
        return container.createComponent(componentFactory);
    }
}
