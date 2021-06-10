import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../interfaces';

@Injectable({ providedIn: 'root' })

export class AuthService {

  private token = null;

  constructor(private http: HttpClient) { }

  public login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/authentication/login', user)
      .pipe(tap(({ token }) => {
        localStorage.setItem('auth-token', token);
        this.setToken(token);
      }));
  }

  public setToken(token: string) { this.token = token; }

  public getToken(): string { return this.token; }

  public isAuthenticated(): boolean { return !!this.token; }

  public logout() {
    this.setToken(null);
    localStorage.clear();
  }
}
