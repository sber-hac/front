import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ModalBreakpointEnum } from '../../models/modal-breakpoint.enum';
import { IonModal } from '@ionic/angular';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-swipe-modal',
    templateUrl: './translate-modal.component.html',
    styleUrls: ['./styles/translate-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('fadeSlideInOut', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(10px)' }),
                animate('100ms', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
        ]),
    ]
})
export class TranslateModalComponent {

    @Input()
    public set modalBreakPoint(value: ModalBreakpointEnum | undefined) {
        if (!value) {
            this.isFullScreen = false;

            return;
        }
        this.isFullScreen = value === ModalBreakpointEnum.full;
    }

    @Input()
    public modal?: IonModal;

    @HostBinding('attr.is-full-size')
    public isFullScreen: boolean = false;

    @Input()
    public maxBreakPoint: number = 1;

    @Input()
    public minimalBreakPoint: number = 0.3;

    public onCrossClick(): void {
        this.modal?.setCurrentBreakpoint(this.minimalBreakPoint);
    }

    public onFullScreenClick(): void {
        this.modal?.setCurrentBreakpoint(this.maxBreakPoint);
    }
}
