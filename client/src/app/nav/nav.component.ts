import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  @ViewChild('loginForm') form: NgForm | undefined;

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login() {
    if (!this.form) {
      return;
    }

    this.accountService
      .login(this.form.value.username, this.form.value.password)
      .subscribe({
        next: (response) => {
          console.log(`Login response: ${response.username}`);
          this.router.navigateByUrl('/members');
        },
        error: (error) => {
          //error is handled by interceptor
          //this.toastr.error(error.error);
          console.log(error);
        },
      });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
