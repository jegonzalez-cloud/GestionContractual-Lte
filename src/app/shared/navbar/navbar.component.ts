import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { cargarIdioma } from 'src/app/store/actions';
import { AppState } from 'src/app/store/app.reducers';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public lenguaje: string = 'es';
  constructor(private router:Router,private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select('idioma').subscribe(({ idioma }) => {
      this.lenguaje = idioma;
    });
  }

  setIdioma() {
    if (this.lenguaje === 'es') {
      this.lenguaje = 'en';
    } else if (this.lenguaje === 'en') {
      this.lenguaje = 'es';
    }
    localStorage.setItem('lang',this.lenguaje)
    this.store.dispatch(cargarIdioma({ idioma: this.lenguaje }));
  }

  logOut(){
    this.router.navigate(['login']);
  }
}
