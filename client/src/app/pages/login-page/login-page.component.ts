import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSub: Subscription;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {

    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params.accessDenied) {
        MaterialService.toast('Для начала нужно авторизироваться');
      } else if (params.sessionFailed) {
        MaterialService.toast('Пожалуйста войдите в систему заного');
      }
    });
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate(['/home']),
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}
