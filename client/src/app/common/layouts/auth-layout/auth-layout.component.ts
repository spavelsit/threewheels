import { Component, OnInit, Input } from '@angular/core';
import {MatDatepicker} from '@angular/material/datepicker'; 
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})


export class AuthLayoutComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/positions'])
      return
    }

    this.route.queryParams.subscribe((params: Params) => {
      if (params.access === 'denied') {
        this.snackBar.open('Доступ запрещен. Для начала нужно авторизироваться');
      } else if (params.session === 'expire') {
        this.snackBar.open('Сессия истекла. Войдите в систему заного');
      }
    });
  }

}
