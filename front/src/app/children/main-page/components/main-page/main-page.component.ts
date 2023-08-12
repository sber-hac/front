import { AfterViewInit, Component, HostListener, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { from, switchMap, takeUntil } from 'rxjs';
import { TranslateModalComponent } from '../translate-modal/translate-modal.component';
import { RtcService } from '../../services/rtc.service';
import { WebsocketService } from '../../../../services/websocket/websocket.service';
import { DestroyService } from '../../../../services/destroy/destroy.service';

@Component({
    templateUrl: './main-page.component.html',
    providers: [
        DestroyService,
        WebsocketService
    ]
})
export class MainPageComponent implements AfterViewInit, OnDestroy {

    @HostListener('click')
    protected openModal(): void {
        from(this.modalController.create({
            component: TranslateModalComponent,
            mode: 'ios',
            animated: true,
            canDismiss: (data?: any, role?: string) => {
                return new Promise<boolean>(resolve => resolve(role === "close"))
            },
            breakpoints: [0, 0.30, 1],
            initialBreakpoint: 0.30,
            cssClass: 'translate-modal',
        }))
            .pipe(
                switchMap((value: HTMLIonModalElement) => from(value.present())),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    constructor(
        protected destroy$: DestroyService,
        protected modalController: ModalController,
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
        this.modalController.dismiss(undefined, "close");
    }

    public ngAfterViewInit(): void {
        // this.rtcService.start()
        //     .pipe(take(1))
        //     .subscribe();
    }
}
