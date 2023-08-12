import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './components/app/app.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AbLetModule } from './directives/let/let.module';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./children/main-page/main-page.module').then((m) => m.MainPageModule),
    },
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        IonicModule.forRoot(),
        HttpClientModule,
        AbLetModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
