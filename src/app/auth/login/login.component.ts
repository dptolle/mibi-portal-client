import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { User } from '../../models/user.model';
import { LoadingSpinnerService } from '../../services/loading-spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  private onLoginSpinner = 'loginSpinner';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private spinnerService: LoadingSpinnerService) { }

  ngOnInit() {
    // reset login status
    this.authService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/main';

    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, Validators.required),
    });
  }

  isLoginSpinnerShowing() {
    return this.spinnerService.isShowing(this.onLoginSpinner);
  }

  login() {
    this.loading = true;

    const user = new User(
      this.loginForm.value.email,
      this.loginForm.value.password
    );

    this.spinnerService.show(this.onLoginSpinner);

    this.authService.login(user)
      .subscribe((data) => {
        this.spinnerService.hide(this.onLoginSpinner);
        this.loginForm.reset();
        if (! data['obj']['token']) {
          this.alertService.error(data['title']);
        } else {
          const currentUser = data['obj'];
          if (currentUser && currentUser.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            this.authService.setCurrentUser(currentUser);
          }
          this.router.navigate([this.returnUrl]);
        }
      }, (err: HttpErrorResponse) => {
        this.spinnerService.hide(this.onLoginSpinner);
        this.loginForm.reset();
        const errObj = JSON.parse(err.error);
        const message = errObj.title + ': ' + errObj.error.message;
        this.alertService.error(message);
        this.loading = false;
      });
  }

}

