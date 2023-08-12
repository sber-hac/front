import { Component, Inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MODAL_BREAKPOINT } from '../../tokens/modal-breackpoint.token';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ModalBreakpointEnum } from '../../models/modal-breakpoint.enum';

@Component({
    selector: 'app-swipe-modal',
    templateUrl: './translate-modal.component.html',
    styleUrls: ['./styles/translate-modal.component.scss']
})
export class TranslateModalComponent {
    public isFullscreen$: Observable<boolean>;

    constructor(
        @Inject(MODAL_BREAKPOINT) protected readonly currentBreakpoint$: BehaviorSubject<ModalBreakpointEnum>,
        private modalCtrl: ModalController
    ) {
        this.isFullscreen$ = this.currentBreakpoint$.pipe(
            map((value: ModalBreakpointEnum) => value === ModalBreakpointEnum.full)
        )
    }
}
