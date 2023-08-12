import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WelcomePageComponent } from './components/welcome-page.component';

const routes: Routes = [
    {
        path: '',
        component: WelcomePageComponent
    },
];

@NgModule({
    declarations: [
        WelcomePageComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        IonicModule,
    ],
})
export class MainPageModule {
}
