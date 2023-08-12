import { Component } from '@angular/core';
import { WebsocketService } from '../../../services/websocket/websocket.service';
import { DestroyService } from '../../../services/destroy/destroy.service';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    providers: [
        WebsocketService,
        DestroyService
    ]
})
export class MainPageComponent {
    constructor(
        protected destroy$: DestroyService,
        protected websocket$: WebsocketService,
    ) {
        this.websocket$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(console.log);
    }
}
