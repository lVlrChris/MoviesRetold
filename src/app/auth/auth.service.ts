import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private user: User;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUser() {
    return this.user;
  }

  private getUserById(userId: string) {
    this.http.get<{ message: string, user: any }>(`${this.apiUrl}api/v1/users/` + userId)
      .pipe(map((data) => {
        return {
          message: data.message,
          user: {
            id: data.user._id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName
          }
        };
      }))
      .subscribe(response => {
        this.user = response.user;
      });
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, firstName: string, lastName: string) {
    const authData: AuthData = { email: email, password: password, firstName: firstName, lastName: lastName };

    return this.http.post(`${this.apiUrl}api/v1/users/register`, authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password, firstName: undefined, lastName: undefined };
    this.http.post<{ message: string, token: string, expiresIn: number, user: any }>(
      `${this.apiUrl}api/v1/users/authenticate`, authData
      )
      .pipe(map((data) => {
        return {
          message: data.message,
          token: data.token,
          expiresIn: data.expiresIn,
          user: {
            id: data.user._id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName
          }
        };
      }))
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.user = response.user;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate, this.user.id);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.getUserById(authInformation.userId);
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.user = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
