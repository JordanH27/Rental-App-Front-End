import { LoginService } from './../login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  email:string = "";
  password:string = "";
  message:any;

  constructor(private logInservice: LoginService, private router:Router) {}

  ngOnInit(){
    
  }

  doLogin(){
    let resp = this.logInservice.login(this.email, this.password);
    resp.subscribe(data=>{
      this.router.navigate(['/property']);
    })

  }

}
