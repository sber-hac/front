import { AfterViewInit, Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { RtcService } from '../../services/rtc.service';
import { WebsocketService } from '../../../../services/websocket/websocket.service';
import { DestroyService } from '../../../../services/destroy/destroy.service';
import { IonModal } from '@ionic/angular';
import { MODAL_BREAKPOINT } from '../../tokens/modal-breackpoint.token';
import { ModalBreakpointEnum } from '../../models/modal-breakpoint.enum';

@Component({
    templateUrl: './main-page.component.html',
    styleUrls: ['./styles/main-page.component.scss'],
    providers: [
        DestroyService,
        WebsocketService
    ]
})
export class MainPageComponent implements AfterViewInit, OnDestroy {

    @ViewChild(IonModal)
    protected modal?: IonModal;

    protected isModalOpen: boolean = true;

    protected currentBreakPoint?: ModalBreakpointEnum;

    constructor(
        protected destroy$: DestroyService,
        protected websocket$: WebsocketService,
        protected readonly rtcService: RtcService,
        @Inject(MODAL_BREAKPOINT) protected readonly currentBreakpoint$: BehaviorSubject<ModalBreakpointEnum>,
    ) {
        this.websocket$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(console.log);
    }

    public checkBreakpoint(event: any): void {
        this.currentBreakPoint = event.detail.breakpoint;
    }

    public ngOnDestroy(): void {
        this.modal?.dismiss(undefined, 'close');
    }

    public ngAfterViewInit(): void {
        // this.rtcService.start()
        //     .pipe(take(1))
        //     .subscribe();
    }
}
