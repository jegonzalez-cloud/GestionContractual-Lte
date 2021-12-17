import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {ChartType, LegendItem} from "chart.js";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexAnnotations,
  ApexGrid
} from "ng-apexcharts";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SecopService} from "../../services/secop/secop.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {newArray} from "@angular/compiler/src/util";
import {utils} from "xlsx";
import * as utilidades from '../../utils/functions'

// export type ChartOptions = {
//   series: ApexAxisChartSeries | any;
//   chart: ApexChart | any;
//   dataLabels: ApexDataLabels | any;
//   plotOptions: ApexPlotOptions | any;
//   xaxis: ApexXAxis | any;
// };

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  xaxis: any; //ApexXAxis;
  annotations: ApexAnnotations | any;
  fill: ApexFill | any;
  stroke: ApexStroke | any;
  grid: ApexGrid | any;
};

export type ChartOptionsDepen = {
  seriesDepen: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  yaxis: ApexYAxis | any;
  xaxis: any; //ApexXAxis;
  annotations: ApexAnnotations | any;
  fill: ApexFill | any;
  stroke: ApexStroke | any;
  grid: ApexGrid | any;
};

export type ChartOptionsPie = {
  seriesPie: ApexNonAxisChartSeries | any;
  chartPie: ApexChart | any;
  responsivePie: ApexResponsive[] | any;
  labelsPie: any;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  public chartOptionsDepen!: Partial<ChartOptions> | any;
  public chartOptionsPie!: Partial<ChartOptionsPie> | any;
  // url: string = 'https://marketplace-formacion.secop.gov.co/CO1Marketplace/Companies/CompanyConfiguration/index';
  displayedColumnsGrafica1: string[] = ['Dependencia','Cantidad', 'Estado', 'Valor Total'];
  displayedColumnsGrafica4: string[] = ['Asociacion', 'Cantidad', 'Valor Total'];
  displayedColumnsGrafica3: string[] = ['Referencia','Asociacion', 'Cantidad', 'Valor Total'];
  dataSource!: MatTableDataSource<any>;
  dataSourceGrafica1!: MatTableDataSource<any>;
  dataSourceGrafica3!: MatTableDataSource<any>;
  dataSourceGrafica4!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  TOKEN: any = atob(localStorage.getItem('token')!);
  tokenEncrypt:any = localStorage.getItem('token');
  gestor!: any;
  entidad = atob(localStorage.getItem('entidad')!);
  ROL: any = atob(localStorage.getItem('rol')!);
  reporte4Form!: FormGroup;
  reporte4FormAsociacion!: FormGroup;
  dashboardForm!: FormGroup;
  dataReport: any;
  dataSeries!: any;
  dataSeriesValor!: any;
  dataAsociacion!: any;
  dataValorAsociacion!: any;
  dataSeriesDepen! : any;
  dataDepen! : any;
  referenciasInProcess!: any;
  asociacionInProcess!: any;

  constructor(private secopService: SecopService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.createForm();
    this.createFormAsociacion();
    this.createFormOpcional();
    this.getcentroGestor();
    this.chartOptions = [];
    this.chartOptionsDepen = [];
    this.chartOptionsPie = [];
    this.getReferenciasInProcess();
    this.getAsociacionInProcess();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  };

  getDataDashboard(id:number) {
    let centroGestor;
    let fechaInicio;
    let fechaTermino;
    let referencia;
    let asociacion;
    if(id == 4){
      centroGestor = this.reporte4FormAsociacion.controls['centroGestor'].value;
      fechaInicio = this.reporte4FormAsociacion.controls['fechaInicio'].value;
      fechaTermino = this.reporte4FormAsociacion.controls['fechaTermino'].value;
      referencia = this.reporte4FormAsociacion.controls['referencia'].value;
      asociacion = this.reporte4FormAsociacion.controls['asociacion'].value;
    }
    else if(id == 3){
      centroGestor = this.reporte4Form.controls['centroGestor'].value;
      fechaInicio = this.reporte4Form.controls['fechaInicio'].value;
      fechaTermino = this.reporte4Form.controls['fechaTermino'].value;
      referencia = this.reporte4Form.controls['referencia'].value;
      asociacion = this.reporte4Form.controls['asociacion'].value;
    }

    this.secopService.getDataDashboard(this.TOKEN, centroGestor, fechaInicio, fechaTermino,referencia,asociacion).subscribe((response: any) => {
      if(response.Status != 'Ok'){
        utilidades.showAlert('No se encontraron registros!','error');
      }
      else{
        this.dataReport = response.Values.ResultFields;
        let cantidadXAsociacion = [];
        let valorTotalXAsociacion = [];
        let labelAsociacion = [];
        for (let i = 0; i < this.dataReport.length; i++) {
          cantidadXAsociacion.push(this.dataReport[i].CANTIDAD);
          valorTotalXAsociacion.push(this.dataReport[i].VALOR_TOTAL);
          labelAsociacion.push(this.dataReport[i].ASOCIACION);
        }
        this.dataSeries = cantidadXAsociacion;
        this.dataAsociacion = labelAsociacion;
        this.dataValorAsociacion = valorTotalXAsociacion;
        this.reporte4FormAsociacion.reset();
        this.infoProcess(id);
      }
    });
  }

  getcentroGestor() {
    this.secopService.getDependenciasSecop(this.entidad, this.ROL).subscribe((response: any) => {
      this.gestor = response.Values.ResultFields;
    })
  }

  createForm() {
    this.reporte4Form = this.fb.group({
      token: new FormControl(atob(localStorage.getItem('token')!)),
      centroGestor: new FormControl({value: '', disabled: false}, [Validators.required]),
      fechaInicio: new FormControl({value: null, disabled: false}, [Validators.required]),
      fechaTermino: new FormControl({value: null, disabled: false}, [Validators.required]),
      referencia: new FormControl({value: '', disabled: false}),
      asociacion: new FormControl({value: '', disabled: false})
    });
  }

  createFormAsociacion() {
    this.reporte4FormAsociacion = this.fb.group({
      token: new FormControl(atob(localStorage.getItem('token')!)),
      centroGestor: new FormControl({value: '', disabled: false}, [Validators.required]),
      fechaInicio: new FormControl({value: null, disabled: false}, [Validators.required]),
      fechaTermino: new FormControl({value: null, disabled: false}, [Validators.required]),
      referencia: new FormControl({value: '', disabled: false}),
      asociacion: new FormControl({value: '', disabled: false})
    });
  }

  createFormOpcional() {
    this.dashboardForm = this.fb.group({
      token: new FormControl(atob(localStorage.getItem('token')!)),
      centroGestor: new FormControl({value: atob(localStorage.getItem('centroGestor')!), disabled: false}, [Validators.required]),
      fechaInicio: new FormControl({value: null, disabled: false}, [Validators.required]),
      fechaTermino: new FormControl({value: null, disabled: false}, [Validators.required]),
    });
  }

  infoProcess(id:number): void {
    if (this.dataReport != null && this.dataReport.length > 0) {
      if(id == 1){
        this.dataSourceGrafica1 = new MatTableDataSource(this.dataReport!);
        this.dataSourceGrafica1.paginator = this.paginator;
        this.dataSourceGrafica1.sort = this.sort;
      }
      if(id == 3){
        this.dataSourceGrafica3 = new MatTableDataSource(this.dataReport!);
        this.dataSourceGrafica3.paginator = this.paginator;
        this.dataSourceGrafica3.sort = this.sort;
      }
      if(id == 4){
        this.dataSourceGrafica4 = new MatTableDataSource(this.dataReport!);
        this.dataSourceGrafica4.paginator = this.paginator;
        this.dataSourceGrafica4.sort = this.sort;
      }
      else{
        this.dataSource = new MatTableDataSource(this.dataReport!);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      this.reporte4Form.controls['centroGestor'].setValue('');
      this.reporte4Form.controls['fechaInicio'].setValue(null);
      this.reporte4Form.controls['fechaTermino'].setValue(null);
      this.dashboardForm.controls['fechaInicio'].setValue(null);
      this.dashboardForm.controls['fechaTermino'].setValue(null);
      this.fillCharts(id);
    } else {
      this.dataSource! = new MatTableDataSource();
    }
  }

  fillCharts(id:number) {
    if(id == 1){
      this.chartOptionsDepen = {
        seriesDepen: [
          {
            name: "Cantidad",
            data: this.dataSeriesDepen
          },
          {
            name: "Valor",
            data: this.dataSeriesValor
          },
        ],
        annotations: {
          points: [
            {
              x: "Bananas",
              seriesIndex: 0,
              label: {
                borderColor: "#775DD0",
                offsetY: 0,
                style: {
                  color: "#fff",
                  background: "#775DD0"
                },
                text: "Bananas are good"
              }
            }
          ]
        },
        chart: {
          height: 350,
          type: "bar"
        },
        plotOptions: {
          bar: {
            columnWidth: "50%",
            // endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },

        grid: {
          row: {
            colors: ["#fff", "#f2f2f2"]
          }
        },
        xaxis: {
          labels: {
            rotate: -45
          },
          categories: this.dataDepen,
          tickPlacement: "on"
        },
        yaxis: {
          title: {
            text: "Servings"
          },

        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          }
        }
      };
    }
    if(id == 3){
      this.chartOptions = {
        series: [
          {
            name: "Valor",
            data: this.dataValorAsociacion
          },
          {
            name: "Cantidad",
            data: this.dataSeries
          },
        ],
        annotations: {
          points: [
            {
              x: "Bananas",
              seriesIndex: 0,
              label: {
                borderColor: "#775DD0",
                offsetY: 0,
                style: {
                  color: "#fff",
                  background: "#775DD0"
                },
                text: "Bananas are good"
              }
            }
          ]
        },
        chart: {
          height: 350,
          type: "bar"
        },
        plotOptions: {
          bar: {
            columnWidth: "50%",
            // endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },

        grid: {
          row: {
            colors: ["#fff", "#f2f2f2"]
          }
        },
        xaxis: {
          labels: {
            rotate: -45
          },
          categories: this.dataAsociacion,
          tickPlacement: "on"
        },
        yaxis: {
          title: {
            text: "Servings"
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          }
        }
      };
    }
    else if(id == 4){
      this.chartOptionsPie = {
        seriesPie: this.dataSeries,
        chartPie: {
          width: 500,
          type: "pie"
        },
        labelsPie: this.dataAsociacion,
        responsivePie: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
    }
    /*else{
      this.chartOptionsPie = {
        seriesPie: this.dataSeries,
        chartPie: {
          width: 500,
          type: "pie"
        },
        labelsPie: this.dataAsociacion,
        responsivePie: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
    }*/
  }

  getReferenciasInProcess() {
    this.secopService.getReferenciasInProcess(this.tokenEncrypt).subscribe((response: any) => {
      this.referenciasInProcess = response.Values.ResultFields;
    });
  }

  getAsociacionInProcess() {
    this.secopService.getAsociacionInProcess(this.tokenEncrypt).subscribe((response: any) => {
      this.asociacionInProcess = response.Values.ResultFields;
    });
  }

  getDataDashboardDepen(id:any){
    let centroGestor = this.dashboardForm.controls['centroGestor'].value;
    let fechaInicio = this.dashboardForm.controls['fechaInicio'].value;
    let fechaTermino = this.dashboardForm.controls['fechaTermino'].value;
    fechaInicio = moment(fechaInicio).format('YYYY-MM-DD');
    fechaTermino = moment(fechaTermino).format('YYYY-MM-DD');
    this.secopService.getDataDashboardDepen(btoa(this.TOKEN),centroGestor,fechaInicio,fechaTermino).subscribe((response:any)=>{
      if(response.Status != 'Ok'){
        utilidades.showAlert('No se encontraron registros!','error');
      }
      else{
        this.dataReport = response.Values.ResultFields;
        let cantidadXDependencia = [];
        let valorXDependencia = [];
        // let cantidadXDependencia = this.dataReport.length;
        let labelDependencia = [];
        for (let i = 0; i < this.dataReport.length; i++) {
          cantidadXDependencia.push(this.dataReport[i].CANTIDAD);
          valorXDependencia.push(this.dataReport[i].VALOR);
          labelDependencia.push(this.dataReport[i].ESTADO);
        }
        this.dataSeriesValor = valorXDependencia;
        this.dataSeriesDepen = cantidadXDependencia;
        this.dataDepen = labelDependencia;
        this.infoProcess(id);
      }
    })
  }

}
