import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs';
import { RtcService } from '../../services/rtc.service';
import { WebsocketService } from '../../../../services/websocket/websocket.service';
import { DestroyService } from '../../../../services/destroy/destroy.service';
import { IonModal } from '@ionic/angular';

@Component({
    templateUrl: './main-page.component.html',
    providers: [
        DestroyService,
        WebsocketService
    ]
})
export class MainPageComponent implements AfterViewInit, OnDestroy {

    @ViewChild(IonModal)
    protected modal?: IonModal;

    protected isModalOpen: boolean = true;

    protected canDismiss: boolean = false;

    constructor(
        protected destroy$: DestroyService,
        protected websocket$: WebsocketService,
        protected readonly rtcService: RtcService,
    ) {
        this.websocket$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(console.log);
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
