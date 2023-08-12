import { Component } from '@angular/core';
import { DestroyService } from '../../../../services/destroy/destroy.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './welcome-page.component.html',
    styleUrls: ['./styles/welcome-page.component.scss'],
    providers: [
        DestroyService
    ]
})
export class WelcomePageComponent  {

    constructor(
        private readonly _router: Router
    ) {
    }

    public toMain(): void {
        this._router.navigate(['main']);
    }
}

