import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./layout/layout/layout.module').then((m) => m.LayoutModule),
      // canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
// const routes: Routes = [
//   { path: 'home', component: LayoutComponent },
//   // { path: 'usuario/:id', component: UsuarioComponent },
//   { path: 'login', component: LayoutComponent },
//   { path: '**', redirectTo: '/login',pathMatch: 'full' },
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
