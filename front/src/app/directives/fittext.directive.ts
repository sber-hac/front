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

    @Input()
    public minFontSize!: number;

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
        const innerText: number = this.el.nativeElement.textContent?.length ?? 0;
        const symbolCount: number = this.container.offsetWidth / this.maxFontSize;
        const diff: number = innerText / symbolCount;
        if (diff !== 0 && !!symbolCount) {
            let size: number = this.fontSize ? parseFloat(this.fontSize) : this.maxFontSize / diff;
            if (size > this.maxFontSize) {
                size = this.maxFontSize;
            } else if (size < this.minFontSize) {
                size = this.minFontSize;
            }
            this.fontSize = `${size}px`;
            const lineHeight = `${size * 1.25}px`
            this.render2.setStyle(this.el.nativeElement, 'fontSize', this.fontSize);
            this.render2.setStyle(this.el.nativeElement, 'line-height', lineHeight);
        } else {
            this.render2.setStyle(this.el.nativeElement, 'fontSize', this.maxFontSize);
        }
    }

}
