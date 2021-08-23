import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from "angular-datatables";
import { NgxCurrencyModule } from "ngx-currency";

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    NgbModule,
    NgxCurrencyModule,
    NgxPaginationModule,
    LayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DataTablesModule
  ],
  exports:[NgbModule],
  providers:[CurrencyPipe]
})
export class LayoutModule {}
