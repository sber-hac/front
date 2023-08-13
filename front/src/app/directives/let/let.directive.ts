import { Directive, Inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { LetContext } from './let-context';

/**
 директива нужна для корректной работы async
 */
@Directive({
    selector: '[appLet]',
})

/** директива для работы с async pipe*/
export class LetDirective<T> {
    @Input()
    public abLet!: T;

    constructor(
        @Inject(ViewContainerRef) viewContainer: ViewContainerRef,
        @Inject(TemplateRef) templateRef: TemplateRef<LetContext<T>>,
    ) {
        viewContainer.createEmbeddedView(templateRef, new LetContext<T>(this));
    }
}
