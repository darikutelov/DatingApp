import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, delay, finalize, identity } from 'rxjs';
import { LoadingService } from '../_services/loading.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.loadingService.startSpinner();

    return next.handle(request).pipe(
      environment.production ? identity : delay(1000), // fake 1 second delay
      finalize(() => this.loadingService.stopSpinner())
    );
  }
}
