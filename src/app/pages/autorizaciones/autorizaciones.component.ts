import {AfterContentInit, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import * as utils from "../../utils/functions";
import {NavigationExtras, Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-autorizaciones',
  templateUrl: './autorizaciones.component.html',
  styleUrls: ['./autorizaciones.component.css']
})
export class AutorizacionesComponent implements OnInit ,AfterViewInit {
  public displayedColumns: string[] = ['Num',	'Nombre',	'Entidad',	'TipoContrato',	'ValorOferta'];
  //Numeración	ID Secop	Nombre del Proceso	Dependencia	Unidad	Equipo	Valor oferta
  public dataSource!: MatTableDataSource<any>;
  public autorizaciones:any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router:Router) { }

  ngAfterViewInit(): void {
    this.infoProcess();
  }
  ngOnInit(): void {
    this.autorizaciones = JSON.parse(localStorage.getItem('autorizaciones')!);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  infoProcess(): void {
    if (this.autorizaciones.length > 0) {
      this.dataSource = new MatTableDataSource(this.autorizaciones!);
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      utils.showAlert('Error de información','error');
    }
  }

  goDetail(row:any){
    // console.log(row.CONS_PROCESO);
    // let row = evento.target.closest('tr').childNodes.item(0).innerHTML
    // alert('elpupy')
    let navigationExtras: NavigationExtras = {
      queryParams: { 'id': row.CONS_PROCESO }
    };

    // Swal.fire(
    //   'Autorización de proceso!',
    //   'Desea Aurizar el proceso # '+row.CONS_PROCESO+'?',
    //   'question'
    // )
    // this.router.navigate(['home/autorizaciones-det/'+row.CONS_PROCESO]);
    // this.router.navigate([route], { queryParams: { id: contact.id } });
    // this.router.navigate(['process']);
  }
}
