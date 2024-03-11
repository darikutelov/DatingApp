import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  requestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) {}

  startSpinner() {
    this.requestCount++;
    this.spinnerService.show(undefined, {
      size: 'medium',
      type: 'ball-clip-rotate',
      bdColor: 'rgba(255, 255, 255, 0)',
      color: '#333333',
    });
  }

  stopSpinner() {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.spinnerService.hide();
    }
  }
}
