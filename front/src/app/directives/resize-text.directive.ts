import {
    AfterViewInit,
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DestroyService } from '../services/destroy/destroy.service';

@Directive({
    selector: '[textResize]',
    providers: [
        DestroyService
    ]
})
export class AngularFittextDirective implements AfterViewInit {

    @Input()
    protected innerText$!: Observable<string>;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        protected destroy$: DestroyService
    ) {
    }

    public ngAfterViewInit(): void {
        this.innerText$
            .pipe(
                tap((value: string) => {

                    // this.el.nativeElement.style.
                })
            )
            .subscribe();
    }
}