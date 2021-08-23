import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
// import { ProcessComponent } from './process/ProcessComponent';
import {ProcessComponent} from './process/process.component';

// ProcessComponent
const routes: Routes = [
  { path: 'home/pages', component: ProcessComponent },
//   { path: 'newRfc', component: NewRFCComponent },
//   { path: 'detailRfc/:rfcCode', component: DetailRfcComponent },
  { path: '', redirectTo: '/home/pages', pathMatch: 'full' },
//   { path: '', component: PagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
