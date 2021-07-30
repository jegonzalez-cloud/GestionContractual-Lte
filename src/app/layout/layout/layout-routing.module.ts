import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/login/login/login.component';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // children: [
    //   {
    //     path: 'administration-ci',
    //     loadChildren: () =>
    //       import('../../pages/administration-ci/administration-ci.module').then(
    //         (m) => m.AdministrationCiModule
    //       ),
    //   },
    // ]
  },
  // { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
