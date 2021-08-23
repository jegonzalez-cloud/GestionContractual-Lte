import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  nameUser: string = '';
  userImage: string = '';
  constructor() {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.nameUser = localStorage.getItem('name')!;
    this.userImage = localStorage.getItem('userImage')!;
    this.userImage = "../../../assets/img/avatar.png";
    //console.log(this.userImage)
    this.nameUser = atob(this.nameUser!);
  }
}
