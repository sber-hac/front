import { Inject, Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { WEBSOCKET_CONFIG } from './tokens/websocket-config.token';
import { IWebsocketConfig } from './interfaces/websocket-config.interface';


@Injectable()
export class WebsocketService extends WebSocketSubject<any> {
    constructor(
        @Inject(WEBSOCKET_CONFIG) protected config: IWebsocketConfig
    ) {
        super(config.urlConfig);
        /** чтобы приходил тестовый вебсокет дата */
        this.next({
            event: 'bts:subscribe',
            data: {
                channel: 'live_trades_btcusd'
            }
        });
    }
}
