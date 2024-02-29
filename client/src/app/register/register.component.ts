import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  @Input() users: any;
  @Output() cancelRegister = new EventEmitter<boolean>();

  constructor(private accountService: AccountService) {}

  register(registerForm: NgForm) {
    if (registerForm.invalid) {
      return;
    }

    this.accountService.register(registerForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.cancel();
      },
      error: (error) => console.log(error),
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
