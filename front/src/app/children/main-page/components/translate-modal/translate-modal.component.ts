import { Component, HostBinding, Input } from '@angular/core';
import { ModalBreakpointEnum } from '../../models/modal-breakpoint.enum';

@Component({
    selector: 'app-swipe-modal',
    templateUrl: './translate-modal.component.html',
    styleUrls: ['./styles/translate-modal.component.scss']
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

    @HostBinding('attr.is-full-size')
    public isFullScreen: boolean = false;

}
