import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})

export class AuthService {

  constructor(
    private http: HttpClient
  ) {}

  public login(user: User): Observable<{ auth_token: string }> {
    return this.http.post<{ auth_token: string }>('/api/v1/auth/token/login', user)
  }

  public setToken(token: string) {
    localStorage.setItem('auth-token', token)
  }

  public getToken(): string {
    return localStorage.getItem('auth-token')
  }

  public isAuthenticated(): boolean {
    return !!this.getToken()
  }

  public logout(): Observable<{}> {
    return this.http.post('/api/v1/auth/token/logout', {})
  }

}