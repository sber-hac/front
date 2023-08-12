import { InjectionToken } from '@angular/core';
import { IWebsocketConfig } from '../interfaces/websocket-config.interface';

export const WEBSOCKET_CONFIG: InjectionToken<IWebsocketConfig> = new InjectionToken<IWebsocketConfig>('конфиг вебсокета', {
    factory: () => ({
        urlConfig: 'someUrl'
    })
});
