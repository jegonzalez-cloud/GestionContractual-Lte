import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar/sidebar.component';
import { FooterComponent } from './footer/footer/footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {MatTooltipModule} from "@angular/material/tooltip";
import {ModalProcessComponent} from "./modal/modal-process/modal-process.component";
import {PagesModule} from "../pages/pages.module";

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, FooterComponent,ModalProcessComponent],
    imports: [CommonModule, TranslateModule, RouterModule, MatTooltipModule],
  exports: [
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    ModalProcessComponent,
    TranslateModule,
    RouterModule
  ],
})
export class SharedModule {}
