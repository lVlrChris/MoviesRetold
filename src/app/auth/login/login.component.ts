import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  returnUrl = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });

    // Get previous route info
    this.route.queryParams.subscribe(params => this.returnUrl = params['return'] || '/');
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.isLoading = true;
      this.authService.loginUser(form.value.email, form.value.password);
      console.log(this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
