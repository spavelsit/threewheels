import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  matcher = new MyErrorStateMatcher();

  oSub: Subscription

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required])
    })
  }

  onSubmit(): void {
    this.oSub = this.authService.login(this.form.value).subscribe(callback => {
      this.authService.setToken(callback.auth_token)
      this.router.navigate(['/positions'])
    }, (err) => {
      this.snackBar.open(err.error.non_field_errors[0])
    })
    
  }

  ngOnDestroy() {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
