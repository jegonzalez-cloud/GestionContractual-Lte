import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar/sidebar.component';
import { FooterComponent } from './footer/footer/footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, FooterComponent],
  imports: [CommonModule, TranslateModule,RouterModule],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    TranslateModule,
  ],
})
export class SharedModule {}
