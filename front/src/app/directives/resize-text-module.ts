import { NgModule } from '@angular/core';
import { AngularFittextDirective } from './resize-text.directive';


@NgModule({
    declarations: [
        AngularFittextDirective
    ],
    exports: [
        AngularFittextDirective
    ]
})

export class ResizeTextModule {
}