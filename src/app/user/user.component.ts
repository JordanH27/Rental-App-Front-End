import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  // static validateUser(): boolean {
  //   throw new Error('Method not implemented.');
  // }

  public users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();

  }

  public getUsers(): void {
    this.userService.getUsers().subscribe((response: User[]) => {
      this.users = response;
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    }
    );
  }
}
