import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated()) {
      
      req = req.clone({setHeaders: {Authorization: `Token ${this.authService.getToken()}`}})
    }
    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => this.handleAuthError(error)))
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401) {
      localStorage.removeItem('auth-token')
      
      this.router.navigate(['/login'], {queryParams: {session: 'expire'}})
    }

    return throwError(error)
  }
}