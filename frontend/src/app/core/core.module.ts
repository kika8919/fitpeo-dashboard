import { NgModule } from '@angular/core';
import { ApiService, DashboardService } from './services';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    DashboardService,
    ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
  ],
})
export class CoreModule {}
