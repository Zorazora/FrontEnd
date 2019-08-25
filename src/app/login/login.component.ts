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
    // for (const control of this.validateForm.controls) {
    //   control.markAsDirty();
    //   control.updateValueAndValidity();
    // }
    console.log('submit');
    sessionStorage.setItem('userID', 'admin');
    this.router.navigate(['']);
  }

  register(): void {
    this.http.post('/api/user/register', this.registerForm).subscribe(data => {
      console.log(data);
    }, error => {
      console.log(error);
    });
  }
}
