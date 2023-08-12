import { AfterViewInit, Component, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { from, switchMap, take, takeUntil } from 'rxjs';
import { TranslateModalComponent } from '../translate-modal/translate-modal.component';
import { RtcService } from '../../services/rtc.service';
import { WebsocketService } from '../../../../services/websocket/websocket.service';
import { DestroyService } from '../../../../services/destroy/destroy.service';

@Component({
    selector: 'app-root',
    templateUrl: './main-page.component.html',
    providers: [
        DestroyService,
        WebsocketService
    ]
})
export class MainPageComponent implements AfterViewInit {

    @HostListener('click')
    protected openModal(): void {
        from(this.modalController.create({
            component: TranslateModalComponent,
            mode: 'ios',
            animated: true,
            canDismiss: false,
            breakpoints: [0, 0.30, 1],
            initialBreakpoint: 0.30,
        }))
            .pipe(
                switchMap((value: HTMLIonModalElement) => from(value.present())),
                takeUntil(this.destroy$),
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

    public ngAfterViewInit(): void {
        this.rtcService.start()
            .pipe(take(1))
            .subscribe();
    }
}
