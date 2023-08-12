import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CommonModule } from '@angular/common';
import { TranslateModalComponent } from './components/translate-modal/translate-modal.component';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
    {
        path: '',
        component: MainPageComponent
    },
];

@NgModule({
    declarations: [
        MainPageComponent,
        TranslateModalComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        IonicModule,
    ],
})
export class MainPageModule {
}