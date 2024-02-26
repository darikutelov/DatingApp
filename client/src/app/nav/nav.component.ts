import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  @ViewChild('loginForm') form: NgForm | undefined;

  constructor(public accountService: AccountService) {}

  login() {
    if (!this.form) {
      return;
    }

    this.accountService
      .login(this.form.value.username, this.form.value.password)
      .subscribe({
        next: (response) => {
          console.log(`Login response: ${response.username}`);
        },
        error: (error) => console.log(error),
      });
  }

  logout() {
    this.accountService.logout();
  }
}
