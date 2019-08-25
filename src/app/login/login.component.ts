import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  private login = true;
  private info = '';

  constructor(private fb: FormBuilder, public router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
    this.registerForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      passwordAgain: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    let logInfo;
    logInfo = {username: this.loginForm.getRawValue().userName, password: this.loginForm.getRawValue().password};
    this.http.post('/api/user/login', logInfo).subscribe(data => {
      if (data.message === 'SUCCESS') {
        sessionStorage.setItem('username', logInfo.username);
        this.router.navigate(['']);
      } else {
        this.info = 'wrong';
        setTimeout(() => {
          this.info = '';
        }, 5000);
      }
    }, error => {
      console.log(error);
    });
  }

  register(): void {
    if (this.registerForm.getRawValue().password !== this.registerForm.getRawValue().passwordAgain) {
      this.info = 'error';
      setTimeout(() => {
        this.info = '';
      }, 5000);
    } else {
      let registInfo;
      registInfo = {username: this.registerForm.getRawValue().userName, password: this.registerForm.getRawValue().password};
      this.http.post('/api/user/register', registInfo).subscribe(data => {
        switch (data.message) {
          case 'SUCCESS':
            this.info = 'success';
            this.login = true;
            break;
          case 'FAIL':
            this.info = 'wrong';
            break;
          case 'FAIL_EXISTED':
            this.info = 'existed';
            break;
        }
        setTimeout(() => {
          this.info = '';
        }, 5000);
      }, error => {
        console.log(error);
      });
    }
  }
}
