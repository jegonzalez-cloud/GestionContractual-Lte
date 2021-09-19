import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  nameUser: string = '';
  userImage: string = '';
  entidad: string = '';
  rol:any = atob(localStorage.getItem('rol')!);
  constructor(private router:Router) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    this.nameUser = localStorage.getItem('name')!;
    this.userImage = localStorage.getItem('userImage')!;
    this.entidad = atob(localStorage.getItem('entidad')!);
    this.userImage = "../../../assets/img/avatar.png";
    //console.log(this.userImage)
    this.nameUser = atob(this.nameUser!);
  }
}
