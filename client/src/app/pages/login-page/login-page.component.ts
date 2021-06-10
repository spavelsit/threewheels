import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MaterialService } from 'src/app/common/utils/material.service';
import { VariableService } from 'src/app/common/services/variable.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  oSub: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private variable: VariableService
  ) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate([this.variable.homePage]);
      return;
    }

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params.access === 'denied') {
        MaterialService.toast('Доступ запрещен. Для начала нужно авторизироваться');
      } else if (params.session === 'expire') {
        MaterialService.toast('Сессия истекла. Войдите в систему заного');
      }
    });
  }

  onSubmit() {
    this.form.disable();

    this.oSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate([this.variable.homePage]),
      error => {
        MaterialService.toast('Проверьте правильность введенных данных');
        this.form.enable();
      }
    );
  }

  ngOnDestroy() {
    if (this.oSub) { this.oSub.unsubscribe(); }
  }

}
