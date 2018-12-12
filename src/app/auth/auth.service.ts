import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;

  constructor(private http: HttpClient) { }

  getToken() {
    return this.token;
  }

  createUser(email: string, password: string, firstName: string, lastName: string) {
    const authData: AuthData = { email: email, password: password, firstName: firstName, lastName: lastName };

    this.http.post('http://localhost:3000/api/v1/users/register', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password, firstName: undefined, lastName: undefined };
    this.http.post<{ message: string, token: string }>('http://localhost:3000/api/v1/users/authenticate', authData)
      .subscribe(response => {
        this.token = response.token;
        console.log(response);
      });
  }
}
