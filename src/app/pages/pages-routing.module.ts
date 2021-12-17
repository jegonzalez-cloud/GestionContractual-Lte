import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
// import { ProcessComponent } from './process/ProcessComponent';
import {ProcessComponent} from './process/process.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AutorizacionesDetailComponent} from "./autorizaciones-detail/autorizaciones-detail.component";
import {AutorizacionesComponent} from "./autorizaciones/autorizaciones.component";
import {AutorizacionesGuard} from "../guards/autorizaciones/autorizaciones.guard";
import {ProcesosGuard} from "../guards/procesos/procesos.guard";
import {BusquedaComponent} from "./busqueda/busqueda.component";
import {DashboardGuard} from "../guards/dashboard/dashboard.guard";
import {BusquedaGuard} from "../guards/busqueda/busqueda.guard";
import {AuthGuard} from "../guards/auth.guard";
import {ReportesComponent} from "./reportes/reportes.component";
import {SampleComponent} from "./sample/sample.component";
import {ConfiguracionComponent} from "./configuracion/configuracion.component";
import {ConfiguracionGuard} from "../guards/configuracion/configuracion.guard";

// ProcessComponent
const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate:[DashboardGuard] },
  { path: 'busqueda', component: BusquedaComponent, canActivate:[BusquedaGuard] },
  { path: 'process', component: ProcessComponent, canActivate:[ProcesosGuard] },
  { path: 'autorizaciones', component: AutorizacionesComponent, canActivate:[AutorizacionesGuard] },
  { path: 'autorizaciones-det/:id', component: AutorizacionesDetailComponent, canActivate:[AutorizacionesGuard] },
  { path: 'reportes', component: ReportesComponent,canLoad:[AuthGuard] },
  { path: 'sample', component: SampleComponent},
  { path: 'configuracion', component: ConfiguracionComponent,canActivate:[ConfiguracionGuard]},
//   { path: 'newRfc', component: NewRFCComponent },
//   { path: 'detailRfc/:rfcCode', component: DetailRfcComponent },
  { path: '**', redirectTo: 'busqueda', pathMatch: 'full' },
  // { path: '', component: PagesComponent,canLoad:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
