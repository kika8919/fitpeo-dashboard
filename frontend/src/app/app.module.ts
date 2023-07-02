import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "./shared/shared.module";

import { CoreModule } from "./core";
import { NavComponent } from "./nav/nav.component";
import { DashComponent } from "./dash/dash.component";
import { CardComponent } from './card/card.component';
import { MiniCardComponent } from './mini-card/mini-card.component';

@NgModule({
  declarations: [AppComponent, NavComponent, DashComponent, CardComponent, MiniCardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
