import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers: any = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const reqClone = this.handleRequests(req, next);

    return next.handle(reqClone);
  }

  handleRequests(req: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(req);
  }
}
