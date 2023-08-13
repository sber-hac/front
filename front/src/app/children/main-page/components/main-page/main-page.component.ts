import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { RtcService } from '../../services/rtc.service';
import { DestroyService } from '../../../../services/destroy/destroy.service';
import { IonModal } from '@ionic/angular';
import { ModalBreakpointEnum } from '../../models/modal-breakpoint.enum';

@Component({
    templateUrl: './main-page.component.html',
    styleUrls: ['./styles/main-page.component.scss'],
    providers: [
        DestroyService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent implements OnDestroy {

    @ViewChild(IonModal)
    protected modal?: IonModal;

    protected isModalOpen: boolean = true;

    protected currentBreakPoint?: ModalBreakpointEnum;


    constructor(
        protected readonly rtcService: RtcService,
    ) {
    }

    public checkBreakpoint(event: any): void {
        this.currentBreakPoint = event.detail.breakpoint;
    }

    public ngOnDestroy(): void {
        this.modal?.dismiss(undefined, 'close');
    }
}
