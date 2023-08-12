import { AfterViewInit, Component } from '@angular/core';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { DestroyService } from '../../../services/destroy/destroy.service';
import { take, takeUntil } from 'rxjs';
import { RtcService } from '../services/rtc.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    providers: [
        WebsocketService,
        DestroyService
    ]
})
export class MainPageComponent implements AfterViewInit {
    constructor(
        protected destroy$: DestroyService,
        protected websocket$: WebsocketService,
        protected readonly rtcService: RtcService
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
