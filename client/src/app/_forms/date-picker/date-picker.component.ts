import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-picker',
  template: `<div class="mb-3">
    <input
      type="text"
      [class.is-invalid]="control.touched && control.invalid"
      class="form-control"
      [formControl]="control"
      placeholder="{{ label }}"
      bsDatepicker
      [bsConfig]="bsConfig"
      [maxDate]="maxDate"
    />
    <div *ngIf="control.errors?.['required']" class="invalid-feedback">
      {{ label }} is required
    </div>
  </div>`,
  styles: [],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() maxDate: Date | undefined;
  bsConfig: Partial<BsDatepickerConfig> | undefined; // Partial makes all properties optional

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;

    // Config the date picker
    this.bsConfig = {
      containerClass: 'theme-green',
      dateInputFormat: 'DD MMMM YYYY',
    };
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
