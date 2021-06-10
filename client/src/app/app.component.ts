import { Component, OnInit } from '@angular/core';
import { AuthService } from './common/services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) { }

  ngOnInit() {
    const candidateToken = localStorage.getItem('auth-token');

    if (candidateToken !== null) { this.auth.setToken(candidateToken); }
  }
}
