import { AfterViewInit, ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ModalBreakpointEnum } from '../../models/modal-breakpoint.enum';
import { IonModal } from '@ionic/angular';
import { animate, style, transition, trigger } from '@angular/animations';
import { WebsocketService } from '../../../../services/websocket/websocket.service';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  interval,
  map,
  Observable,
  scan,
  Subject,
  takeUntil,
  takeWhile,
} from 'rxjs';
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
    ]
})
export class TranslateModalComponent implements AfterViewInit {

    @Input()
    public set modalBreakPoint(value: ModalBreakpointEnum | undefined) {
        if (!value) {
            this.isFullScreen = false;

            return;
        }
        this.buttonClicked = false;
        this.isFullScreen = value === ModalBreakpointEnum.full;
        if (!this.isFullScreen) {
            // this.rtc.startVideo()
            //     .pipe(
            //         takeUntil(this.endVideoStream$)
            //     )
            //     .subscribe();
        } else {
            this.hardText$.next('');
            this._dest$.next();
            this.endVideoStream$.next();
            this.endVideoStream$.complete();
        }
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

    protected hardText$: BehaviorSubject<string> = new BehaviorSubject('');

    private _hardText$: Observable<string> = interval(1000)
      .pipe(
        takeWhile(a => a < this._text.length),
        map((a) => this._text[a]),
        scan((a, c) => a + ' ' + c),
      );

    private _dest$: Subject<void> = new Subject();

    protected endAudioStream$: Subject<void> = new Subject<void>();

    protected endVideoStream$: Subject<void> = new Subject<void>();

    private _text: string[] = 'Каждый охотник желает знать где сидит фазан'.split(' ');

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

    public ngAfterViewInit(): void {
        this.rtc.startVideo()
            .pipe(
                takeUntil(this.endVideoStream$)
            )
            .subscribe();
    }

    public onButtonClick(): void {
        this.buttonClicked = !this.buttonClicked;
        if (!this.buttonClicked) {
            this.endAudioStream$.next();
            this.endAudioStream$.complete();
            this._dest$.next();
        } else {
          const obs2 = this.hardText$;
          this._hardText$
            .pipe(
              takeUntil(this._dest$),
              takeUntil(this.destroy$),
            ).subscribe(obs2);
            this.rtc.startAudio()
                .pipe(
                    takeUntil(this.endAudioStream$)
                )
                .subscribe();
        }
    }

    public onCrossClick(): void {
        this.modal?.setCurrentBreakpoint(this.minimalBreakPoint);
    }

    public onFullScreenClick(): void {
        this.modal?.setCurrentBreakpoint(this.maxBreakPoint);
    }
}
