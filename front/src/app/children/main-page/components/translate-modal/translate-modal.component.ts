import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    templateUrl: './translate-modal.component.html',
    styleUrls: ['./styles/translate-modal.component.scss']
})
export class TranslateModalComponent {
    constructor(private modalCtrl: ModalController) {
    }
}