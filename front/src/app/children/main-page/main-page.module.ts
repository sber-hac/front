import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    {
        path: '',
        component: MainPageComponent
    },
];

@NgModule({
    declarations: [
        MainPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ],
})
export class MainPageModule {
}
