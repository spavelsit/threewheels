import { Component, OnInit } from '@angular/core';
import { AuthService } from './common/services/auth.service';

const newLocal = '<router-outlet></router-outlet>';
@Component({
  selector: 'app-root',
  template: newLocal,
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('auth-token')

    if (token !== null) this.authService.setToken(token)
  }
}
