import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { CommonModule } from '@angular/common';
import { TranslateModalComponent } from './components/translate-modal/translate-modal.component';
import { IonicModule } from '@ionic/angular';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
    },
    {
        path: 'welcome',
        component: WelcomePageComponent
    },
    {
        path: 'main',
        component: MainPageComponent
    },
    {
        path: '**',
        redirectTo: 'welcome'
    }
];

@NgModule({
    declarations: [
        MainPageComponent,
        WelcomePageComponent,
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
