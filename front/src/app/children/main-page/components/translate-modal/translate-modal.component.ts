import { AfterViewInit, ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ModalBreakpointEnum } from '../../models/modal-breakpoint.enum';
import { IonModal } from '@ionic/angular';
import { animate, style, transition, trigger } from '@angular/animations';
import { WebsocketService } from '../../../../services/websocket/websocket.service';
import { BehaviorSubject, distinctUntilChanged, filter, map, of, scan, Subject, switchMap, take, takeUntil } from 'rxjs';
import { DestroyService } from '../../../../services/destroy/destroy.service';
import { RtcService } from '../../services/rtc.service';

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
    ],
    providers: [
        WebsocketService,
        RtcService
    ]
})
export class TranslateModalComponent {

    @Input()
    public set modalBreakPoint(value: ModalBreakpointEnum | undefined) {
        if (!value) {
            this.isFullScreen = false;

            return;
        }
        this.buttonClicked = false;
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

    protected buttonClicked: boolean = false;

    protected text$: BehaviorSubject<string> = new BehaviorSubject('');

    protected endStream$: Subject<void> = new Subject<void>();

    constructor(
        protected destroy$: DestroyService,
        protected rtc: RtcService,
        protected websocket$: WebsocketService,
    ) {
        const obs = this.text$;
        this.websocket$
            .pipe(
                filter((text: string) => !!text && text !== 'нет жеста'),
                distinctUntilChanged(),
                scan((a, c) => a + ' ' + c),
                takeUntil(this.destroy$),
            ).subscribe(obs);
    }

    public onButtonClick(): void {
        this.buttonClicked = !this.buttonClicked;
        if (!this.buttonClicked) {
            this.endStream$.next();
            this.endStream$.complete();
        } else {
            this.rtc.startAudio()
                .pipe(
                    takeUntil(this.endStream$)
                )
                .subscribe({
                    complete: () => {
                        this.rtc.stop();
                    }
                });
        }
    }

    public onCrossClick(): void {
        this.modal?.setCurrentBreakpoint(this.minimalBreakPoint);
    }

    public onFullScreenClick(): void {
        this.modal?.setCurrentBreakpoint(this.maxBreakPoint);
    }
}
