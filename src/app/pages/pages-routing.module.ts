import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
// import { ProcessComponent } from './process/ProcessComponent';
import {ProcessComponent} from './process/process.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AutorizacionesDetailComponent} from "./autorizaciones-detail/autorizaciones-detail.component";
import {AutorizacionesComponent} from "./autorizaciones/autorizaciones.component";

// ProcessComponent
const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'process', component: ProcessComponent },
  { path: 'autorizaciones', component: AutorizacionesComponent },
  { path: 'autorizaciones-det/:id', component: AutorizacionesDetailComponent },

//   { path: 'newRfc', component: NewRFCComponent },
//   { path: 'detailRfc/:rfcCode', component: DetailRfcComponent },
  { path: '**', redirectTo: 'process', pathMatch: 'full' },
//   { path: '', component: PagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
