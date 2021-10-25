import {Component, OnInit, ViewChild} from '@angular/core';
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
  public chartOptions!: Partial<ChartOptions>;
  public chartOptionsPie!: Partial<ChartOptionsPie> | any;
  // url: string = 'https://marketplace-formacion.secop.gov.co/CO1Marketplace/Companies/CompanyConfiguration/index';
  displayedColumnsGrafica1: string[] = ['Dependencia', 'Cantidad', 'Valor Total'];
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
  dataReport: any;
  dataSeries!: any;
  dataAsociacion!: any;
  referenciasInProcess!: any;
  asociacionInProcess!: any;

  constructor(private secopService: SecopService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.createForm();
    this.createFormOpcional();
    this.getcentroGestor();
    this.chartOptions = {
      series: [
        {
          name: "basic",
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        },
        {
          name1: "basic1",
          data2: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: [
          "South Korea",
          "Canada",
          "United Kingdom",
          "Netherlands",
          "Italy",
          "France",
          "Japan",
          "United States",
          "China",
          "Germany"
        ]
      }
    };
    this.chartOptions = [];
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
    let centroGestor = this.reporte4Form.controls['centroGestor'].value;
    let fechaInicio = this.reporte4Form.controls['fechaInicio'].value;
    let fechaTermino = this.reporte4Form.controls['fechaTermino'].value;
    let referencia = this.reporte4Form.controls['referencia'].value;
    let asociacion = this.reporte4Form.controls['asociacion'].value;
    this.secopService.getDataDashboard(this.TOKEN, centroGestor, fechaInicio, fechaTermino,referencia,asociacion).subscribe((response: any) => {
      // console.log(response);

      if(response.Status != 'Ok'){
        utilidades.showAlert('No se encontraron registros!','error');
      }
      else{
        this.dataReport = response.Values.ResultFields;
        let cantidadXAsociacion = [];
        let labelAsociacion = [];
        for (let i = 0; i < this.dataReport.length; i++) {
          cantidadXAsociacion.push(this.dataReport[i].CANTIDAD);
          labelAsociacion.push(this.dataReport[i].ASOCIACION);
        }
        this.dataSeries = cantidadXAsociacion;
        this.dataAsociacion = labelAsociacion;
        this.infoProcess(id);
      }
    });
  }

  getcentroGestor() {
    this.secopService.getDependenciasSecop(this.entidad, this.ROL).subscribe((response: any) => {
      console.log(response);
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

  createFormOpcional() {
    this.reporte4Form = this.fb.group({
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
      this.fillCharts(id);
    } else {
      this.dataSource = new MatTableDataSource();
    }
  }

  fillCharts(id:number) {
    // let xxx = this.dataSeries;
    console.log(this.dataSeries)
    console.log(this.dataAsociacion)
    if(id == 1){
      this.chartOptions = {
        series: [
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
    if(id == 3){
      this.chartOptions = {
        series: [
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
    else{
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

}
