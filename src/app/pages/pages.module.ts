import { NgModule } from '@angular/core';
import { ProcessComponent } from './process/process.component';
import { PagesComponent } from './pages.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { DataTablesModule } from "angular-datatables";
import { NgxCurrencyModule } from "ngx-currency";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {A11yModule} from "@angular/cdk/a11y";
import {CdkStepperModule} from "@angular/cdk/stepper";
import {CdkTreeModule} from "@angular/cdk/tree";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatBadgeModule} from "@angular/material/badge";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {CdkTableModule} from "@angular/cdk/table";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatChipsModule} from "@angular/material/chips";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatDividerModule} from "@angular/material/divider";
import {MatDialogModule} from "@angular/material/dialog";
import {MatStepperModule} from "@angular/material/stepper";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRadioModule} from "@angular/material/radio";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTreeModule} from "@angular/material/tree";
import {MatToolbarModule} from "@angular/material/toolbar";
import {OverlayModule} from "@angular/cdk/overlay";
import {PortalModule} from "@angular/cdk/portal";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { DashboardComponent } from './dashboard/dashboard.component';
import { AutorizacionesComponent } from './autorizaciones/autorizaciones.component';
import { AutorizacionesDetailComponent } from './autorizaciones-detail/autorizaciones-detail.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import { ReportesComponent } from './reportes/reportes.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { SampleComponent } from './sample/sample.component';
// import {NzTreeSelectModule} from "ng-zorro-antd/tree-select";
import {TreeSelectModule} from "primeng/treeselect";
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { NgxLoadingModule } from 'ngx-loading';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
// import { ModalProcessComponent } from '../shared/modal/modal-process/modal-process.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProcessComponent,
    PagesComponent,
    AutorizacionesComponent,
    AutorizacionesDetailComponent,
    BusquedaComponent,
    ReportesComponent,
    SampleComponent,
    ConfiguracionComponent,
    // ModalProcessComponent
  ],
  imports: [
    CommonModule,
    //DataTablesModule,
    NgbModule,
    NgxChartsModule,
    NgxCurrencyModule,
    PagesRoutingModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    SharedModule,
    // BrowserAnimationsModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    NgApexchartsModule,
    TreeSelectModule,
    NgxLoadingModule.forRoot({}),
    AutocompleteLibModule
  ],
  // exports:[NgbModule,TranslateModule],
  // exports:[ModalProcessComponent],
  // providers:[CurrencyPipe]
})

export class PagesModule { }
