import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  template: `<div class="mb-3">
    <input
      type="{{ type }}"
      [class.is-invalid]="control.touched && control.invalid"
      class="form-control"
      [formControl]="control"
      placeholder="{{ label }}"
    />
    <div class="invalid-feedback" *ngIf="control.errors?.['required']">
      Please enter a {{ label }}
    </div>
    <div class="invalid-feedback" *ngIf="control.errors?.['minlength']">
      {{ label }} must be at least
      {{control.errors?.['minlength'].requiredLength}} characters
    </div>
    <div class="invalid-feedback" *ngIf="control.errors?.['maxlength']">
      {{ label }} must be at most
      {{control.errors?.['maxlength'].requiredLength}} characters
    </div>
    <div class="invalid-feedback" *ngIf="control.errors?.['notMatching']">
      Passwords do not match
    </div>
  </div>`,
  styles: [],
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';

  constructor(@Self() public ngControl: NgControl) {
    /*
     * Angular will attempt to re-use services from anywhere in the component tree.
     * When we use @self we tell Angular that this is a service that we do not want to re-use and
     * to create an instance specifically for this component.
     * We do not want to re-use the ngControl here and needs to be unique for each input.
     */

    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
