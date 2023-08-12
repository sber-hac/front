import { AfterViewChecked, AfterViewInit, Directive, ElementRef, HostBinding, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[fittext]'
})
export class FittextDirective implements AfterViewChecked, AfterViewInit, OnDestroy {

    @Input()
    public container!: HTMLElement;

    @Input()
    public maxFontSize!: number;

    @HostBinding('style.width')
    protected readonly width: string = 'fit-content';

    protected fontSize?: string;

    private _resize?: ResizeObserver;

    constructor(
        @Inject(ElementRef) protected readonly el: ElementRef<HTMLElement>,
        @Inject(Renderer2) protected readonly render2: Renderer2
    ) { }


    public ngAfterViewChecked(): void {
        this.setFontSize();
    }

    public ngAfterViewInit(): void {
        this._resize = new ResizeObserver(() => this.setFontSize());
        this._resize.observe(this.container);
    }

    public ngOnDestroy(): void {
        this._resize?.disconnect();
    }

    /**
     * установка стилей
     */
    protected setFontSize(): void {
        const contentWidth: number = this.el.nativeElement.scrollWidth;
        const containerwidth: number = this.container.offsetWidth;
        const diff: number = contentWidth / containerwidth;
        if (diff !== 0) {
            this.fontSize = `${Math.min(((this.fontSize ? parseFloat(this.fontSize) : this.maxFontSize) / diff), this.maxFontSize)}px`;
            this.render2.setStyle(this.el.nativeElement, 'fontSize', this.fontSize);
        } else {
            this.render2.setStyle(this.el.nativeElement, 'fontSize', this.maxFontSize);
        }
    }

}
