import { NgModule } from '@angular/core';
import { ProcessComponent } from './process/process.component';
import { PagesComponent } from './pages.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from "angular-datatables";
import { NgxCurrencyModule } from "ngx-currency";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ProcessComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgxCurrencyModule,
    NgxPaginationModule,
    PagesRoutingModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    DataTablesModule
  ],
  exports:[NgbModule,TranslateModule],
  providers:[CurrencyPipe]
})

export class PagesModule { }
