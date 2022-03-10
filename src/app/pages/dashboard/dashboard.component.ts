import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import * as $ from 'jquery'
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
  ApexGrid, ApexTheme, ApexMarkers, ApexTitleSubtitle
} from "ng-apexcharts";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SecopService} from "../../services/secop/secop.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {newArray} from "@angular/compiler/src/util";
import {utils} from "xlsx";
import * as utilidades from '../../utils/functions'
import {showAlert} from "../../utils/functions";
import {Moment} from "moment";
import {MatDatepicker} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';

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

export type ChartOptionsProcesosXmes = {
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

export type ChartOptionsEstadosProceso = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  fill: ApexFill | any;
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

export type ChartOptionsProcesosXasociacion = {
  seriesPie: ApexNonAxisChartSeries | any;
  chartPie: ApexChart | any;
  responsivePie: ApexResponsive[] | any;
  labelsPie: any;
};

export type ChartOptionsProcesosXreferencia = {
  seriesPie: ApexNonAxisChartSeries | any;
  chartPie: ApexChart | any;
  responsivePie: ApexResponsive[] | any;
  labelsPie: any;
};

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY'
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

export type ChartOptionsProcesosXdependencia = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})

export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;
  public chartOptionsDepen!: Partial<ChartOptionsDepen> | any;
  public chartOptionsPie!: Partial<ChartOptionsPie> | any;
  public chartOptionsProcesosXmes!: Partial<ChartOptionsProcesosXmes> | any;
  public chartOptionsEstadosProceso!: Partial<ChartOptionsEstadosProceso> | any;
  public chartOptionsProcesosXdependencia!: Partial<ChartOptionsProcesosXdependencia> | any;
  public chartOptionsProcesosXasociacion!: Partial<ChartOptionsProcesosXasociacion> | any;
  public chartOptionsProcesosXreferencia!: Partial<ChartOptionsProcesosXreferencia> | any;
  // url: string = 'https://marketplace-formacion.secop.gov.co/CO1Marketplace/Companies/CompanyConfiguration/index';
  displayedColumnsGrafica1: string[] = ['Dependencia', 'Cantidad', 'Estado', 'Valor Total'];
  displayedColumnsGrafica4: string[] = ['Asociacion', 'Cantidad', 'Valor Total'];
  displayedColumnsGrafica3: string[] = ['Referencia', 'Asociacion', 'Cantidad', 'Valor Total'];
  dataSource!: MatTableDataSource<any>;
  dataSourceProcesosXmes!: MatTableDataSource<any>;
  dataSourceEstadosProceso!: MatTableDataSource<any>;
  dataSourceProcesosXdependencia!: MatTableDataSource<any>;
  dataSourceProcesosXasociacion!: MatTableDataSource<any>;
  dataSourceProcesosXreferencia!: MatTableDataSource<any>;
  dataSourceGrafica1!: MatTableDataSource<any>;
  dataSourceGrafica3!: MatTableDataSource<any>;
  dataSourceGrafica4!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  TOKEN: any = atob(localStorage.getItem('token')!);
  tokenEncrypt: any = localStorage.getItem('token');
  centroGestor: any = atob(localStorage.getItem('centroGestor')!);
  gestor!: any;
  entidad = atob(localStorage.getItem('entidad')!);
  ROL: any = atob(localStorage.getItem('rol')!);
  reporte4Form!: FormGroup;
  reporte4FormAsociacion!: FormGroup;
  reporte4FormReferencia!: FormGroup;
  dashboardForm!: FormGroup;
  reportesXmesForm!: FormGroup;
  reportesXestadoForm!: FormGroup;
  reportesXdependenciaForm!: FormGroup;
  dataReport: any;
  dataProcesosXmes: any;
  dataEstadosProceso: any;
  dataProcesosXdependencia_cantidad: any;
  dataProcesosXdependencia_valor: any;
  dataProcesosXdependencia_centro_gestor: any;
  dataProcesosXestado_estado: any;
  dataProcesosXestado_valor: any;
  dataProcesosXasociacion: any;
  dataProcesosXreferencia: any;
  dataSeries!: any;
  dataSeriesValor!: any;
  dataAsociacion!: any;
  dataValorAsociacion!: any;
  dataSeriesDepen!: any;
  dataDepen!: any;
  referenciasInProcess!: any;
  asociacionInProcess!: any;
  arrayData!: number[];
  //
  procesos_vencen_hoy!: any;
  procesos_vencidos!: any;
  procesos_abiertos!: any;
  procesos_espera!: any;
  //
  dataProcesosXestado_cantidad!: any[];
  fechaInicial = new FormControl(moment());
  fechaTerminal = new FormControl(moment());
  arrayNameAsociacion!: any;
  arrayQuantityAsociacion!: any;
  arrayNameReferencia!: any;
  arrayQuantityReferencia!: any;
  private tipo!: string;

  constructor(private secopService: SecopService, private fb: FormBuilder) {
    this.chartOptions = {
      series: [],
      chart: {},
      dataLabels: {},
      plotOptions: {},
      yaxis: {},
      xaxis: {},
      annotations: {},
      fill: {},
      stroke: {},
      grid: {}
    };
    this.chartOptionsProcesosXmes = {
      series: [],
      chart: {},
      dataLabels: {},
      plotOptions: {},
      yaxis: {},
      xaxis: {},
      annotations: {},
      fill: {},
      stroke: {},
      grid: {}
    };
    this.chartOptionsEstadosProceso = {
      series: [],
      chart: {},
      dataLabels: {},
      plotOptions: {},
      yaxis: {},
      xaxis: {},
      annotations: {},
      fill: {},
      stroke: {},
      grid: {}
    };
    this.chartOptionsProcesosXdependencia = {
      series: [],
      chart: {},
      dataLabels: {},
      plotOptions: {},
      yaxis: {},
      xaxis: {},
      annotations: {},
      fill: {},
      stroke: {},
      grid: {}
    };
    this.chartOptionsDepen = {
      series: [],
      chart: {},
      dataLabels: {},
      plotOptions: {},
      yaxis: {},
      xaxis: {},
      annotations: {},
      fill: {},
      stroke: {},
      grid: {}
    };
    this.chartOptionsPie = {
      series: [],
      chart: {},
      responsive: [],
      labels: []
    };
    this.chartOptionsProcesosXasociacion = {
      series: [],
      chart: {},
      responsive: [],
      labels: []
    };
    this.chartOptionsProcesosXreferencia = {
      series: [],
      chart: {},
      responsive: [],
      labels: []
    };
  }

  ngOnInit(): void {
    this.createForm();
    this.createFormAsociacion();
    this.createFormOpcional();
    // this.getReferenciasInProcess();
    // this.getAsociacionInProcess();
    this.getcentroGestor();
    this.getDataCuadrosEstado();

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getDataLineChart();
      this.getDataProcesosXestadoChart();
      // this.getDataAsociacionReferencia();
      this.getDataProcesosXdependenciaChart();
      this.getDataAsociacion();
      this.getDataReferencia();
    }, 500);

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  };

  getDataDashboard(id: number) {
    let centroGestor;
    let fechaInicio;
    let fechaTermino;
    let referencia;
    let asociacion;
    if (id == 4) {
      centroGestor = this.reporte4FormAsociacion.controls['centroGestor'].value;
      fechaInicio = this.reporte4FormAsociacion.controls['fechaInicio'].value;
      fechaTermino = this.reporte4FormAsociacion.controls['fechaTermino'].value;
      referencia = this.reporte4FormAsociacion.controls['referencia'].value;
      asociacion = this.reporte4FormAsociacion.controls['asociacion'].value;
    } else if (id == 3) {
      centroGestor = this.reporte4Form.controls['centroGestor'].value;
      fechaInicio = this.reporte4Form.controls['fechaInicio'].value;
      fechaTermino = this.reporte4Form.controls['fechaTermino'].value;
      referencia = this.reporte4Form.controls['referencia'].value;
      asociacion = this.reporte4Form.controls['asociacion'].value;
    }

    this.secopService.getDataDashboard(this.TOKEN, centroGestor, fechaInicio, fechaTermino, referencia, asociacion).subscribe((response: any) => {
      if (response.Status != 'Ok') {
        utilidades.showAlert('No se encontraron registros!', 'error');
      } else {
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
    // this.reporte4Form = this.fb.group({
    //   token: new FormControl(atob(localStorage.getItem('token')!)),
    //   centroGestor: new FormControl({value: '', disabled: false}, [Validators.required]),
    //   fechaInicio: new FormControl({value: null, disabled: false}, [Validators.required]),
    //   fechaTermino: new FormControl({value: null, disabled: false}, [Validators.required]),
    //   referencia: new FormControl({value: '', disabled: false}),
    //   asociacion: new FormControl({value: '', disabled: false})
    // });

    this.reportesXmesForm = this.fb.group({
      fechaInicioXmes: new FormControl({value: null, disabled: false}, [Validators.required]),
      fechaTerminoXmes: new FormControl({value: null, disabled: false}, [Validators.required]),
      centroGestor: new FormControl((this.ROL != 4) ? atob(localStorage.getItem('centroGestor')!) : '')
    });

    this.reportesXestadoForm = this.fb.group({
      fechaInicioXestado: new FormControl({value: null, disabled: false}, [Validators.required]),
      fechaTerminoXestado: new FormControl({value: null, disabled: false}, [Validators.required]),
      centroGestor: new FormControl((this.ROL != 4) ? atob(localStorage.getItem('centroGestor')!) : '')
    });

    this.reportesXdependenciaForm = this.fb.group({
      fechaInicioXdependencia: new FormControl({value: null, disabled: false}, [Validators.required]),
      fechaTerminoXdependencia: new FormControl({value: null, disabled: false}, [Validators.required]),
      centroGestor: new FormControl((this.ROL != 4) ? atob(localStorage.getItem('centroGestor')!) : '')
    });
  }

  createFormAsociacion() {
    this.reporte4FormAsociacion = this.fb.group({
      token: new FormControl(atob(localStorage.getItem('token')!)),
      centroGestor: new FormControl({value: '', disabled: false}),
      fechaInicio: new FormControl({value: null, disabled: false}, [Validators.required]),
      fechaTermino: new FormControl({value: null, disabled: false}, [Validators.required]),
      asociacion: new FormControl({value: '', disabled: false})
    });
    this.reporte4FormReferencia = this.fb.group({
      token: new FormControl(atob(localStorage.getItem('token')!)),
      centroGestor: new FormControl({value: '', disabled: false}),
      fechaInicio: new FormControl({value: null, disabled: false}, [Validators.required]),
      fechaTermino: new FormControl({value: null, disabled: false}, [Validators.required]),
      referencia: new FormControl({value: '', disabled: false})
    });
  }

  createFormOpcional() {
    this.dashboardForm = this.fb.group({
      token: new FormControl(atob(localStorage.getItem('token')!)),
      centroGestor: new FormControl({
        value: atob(localStorage.getItem('centroGestor')!),
        disabled: false
      }, [Validators.required]),
      fechaInicio: new FormControl({value: null, disabled: false}, [Validators.required]),
      fechaTermino: new FormControl({value: null, disabled: false}, [Validators.required]),
    });
  }

  infoProcess(id: number): void {
    if (this.dataReport != null && this.dataReport.length > 0 || this.dataProcesosXmes != null || this.dataSourceProcesosXasociacion != null) {
      if (id == 1) {
        this.dataSourceGrafica1 = new MatTableDataSource(this.dataReport!);
        this.dataSourceGrafica1.paginator = this.paginator;
        this.dataSourceGrafica1.sort = this.sort;
      } else if (id == 3) {
        this.dataSourceGrafica3 = new MatTableDataSource(this.dataReport!);
        this.dataSourceGrafica3.paginator = this.paginator;
        this.dataSourceGrafica3.sort = this.sort;
      } else if (id == 4) {
        this.dataSourceGrafica4 = new MatTableDataSource(this.dataReport!);
        this.dataSourceGrafica4.paginator = this.paginator;
        this.dataSourceGrafica4.sort = this.sort;
      } else if (id == 5) {
        this.dataSourceProcesosXmes = new MatTableDataSource(this.dataProcesosXmes!);
        this.dataSourceProcesosXmes.paginator = this.paginator;
        this.dataSourceProcesosXmes.sort = this.sort;
      } else if (id == 6) {
        this.dataSourceEstadosProceso = new MatTableDataSource(this.dataProcesosXmes!);
        this.dataSourceEstadosProceso.paginator = this.paginator;
        this.dataSourceEstadosProceso.sort = this.sort;
      } else if (id == 7) {
        this.dataSourceProcesosXdependencia = new MatTableDataSource(this.dataProcesosXdependencia_valor!);
        this.dataSourceProcesosXdependencia.paginator = this.paginator;
        this.dataSourceProcesosXdependencia.sort = this.sort;
      } else if (id == 8) {
        this.dataSourceProcesosXasociacion = new MatTableDataSource(this.dataProcesosXasociacion!);
        this.dataSourceProcesosXasociacion.paginator = this.paginator;
        this.dataSourceProcesosXasociacion.sort = this.sort;
      } else if (id == 9) {
        this.dataSourceProcesosXreferencia = new MatTableDataSource(this.dataProcesosXreferencia!);
        this.dataSourceProcesosXreferencia.paginator = this.paginator;
        this.dataSourceProcesosXreferencia.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource(this.dataReport!);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      // this.reporte4Form.controls['centroGestor'].setValue('');
      // this.reporte4Form.controls['fechaInicio'].setValue(null);
      // this.reporte4Form.controls['fechaTermino'].setValue(null);
      this.dashboardForm.controls['fechaInicio'].setValue(null);
      this.dashboardForm.controls['fechaTermino'].setValue(null);
      this.fillCharts(id);
    } else {
      this.dataSource! = new MatTableDataSource();
    }
  }

  fillCharts(id: number) {
    if (id == 1) {
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
    } else if (id == 3) {
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
    } else if (id == 4) {
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
    } else if (id == 5) {
      this.chartOptionsProcesosXmes = {
        series: [
          {
            name: "Cantidad Contratos",
            data: this.arrayData
          }
        ],
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          // curve: "straight"
          width: 5,
          curve: "smooth"
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            // gradientToColors: ["#FDD835"],
            gradientToColors: ["#B1D39D"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          }
        },
        title: {
          text: "Cantidad de Contratos por mes",
          align: "center",
          style: {
            fontWeight: 1
          }
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic"
          ]
        }
      };
    } else if (id == 6) {
      this.chartOptionsEstadosProceso = {
        series: [
          {
            name: "Cantidad Contratos",
            // name: "Valor contrato",
            data: [
              this.dataProcesosXestado_cantidad[0], this.dataProcesosXestado_cantidad[1],
              this.dataProcesosXestado_cantidad[2], this.dataProcesosXestado_cantidad[3],
              this.dataProcesosXestado_cantidad[4], this.dataProcesosXestado_cantidad[5]
            ]
          }
        ],
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          // colors: ['#40A31D'],
          type: "gradient"
        },
        title: {
          text: "Cantidad de Contratos por estado",
          align: "center",
          style: {
            fontWeight: 1
          }
        },
        xaxis: {
          categories: [
            this.titleCaseWord(this.dataProcesosXestado_estado[0]), this.titleCaseWord(this.dataProcesosXestado_estado[1]),
            this.titleCaseWord(this.dataProcesosXestado_estado[2]), this.titleCaseWord(this.dataProcesosXestado_estado[3]),
            this.titleCaseWord(this.dataProcesosXestado_estado[4]), this.titleCaseWord(this.dataProcesosXestado_estado[5]),
          ]
        }
      };
    } else if (id == 7) {
      this.chartOptionsProcesosXdependencia = {
        // series: [44, 55, 13, 43, 22,44, 55, 13, 43, 22,44, 55, 13, 43, 22],
        // chart: {
        //   width: 380,
        //   type: "pie"
        // },
        // fill: {
        //   type: "gradient",
        //   colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800',	'#4ECDC4'	,'#C7F464'	,'#81D4FA',	'#546E7A',	'#FD6A6A']
        // },
        // theme: {
        //   monochrome: {
        //     enabled: false
        //   }
        // },
        // title: {
        //   text: "Cantidad de procesos por dependencia",
        //   align: "center",
        //   style: {
        //     fontWeight: 1
        //   }
        // },
        // labels: ["A", "B", "C", "D", "E","F", "G", "H", "I", "J","K", "L", "M", "N", "O"],
        // responsive: [
        //   {
        //     breakpoint: 480,
        //     options: {
        //       chart: {
        //         width: 200
        //       },
        //     }
        //   }
        // ]
        series: [
          {
            name: "Valor Contratos",
            type: "column",
            data: this.dataProcesosXdependencia_valor
            // data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160,440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160,468]
          },
          {
            name: "Cantidad Contratos",
            type: "line",
            data: this.dataProcesosXdependencia_cantidad
            // data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16,23, 42, 35, 27, 43, 22, 17, 31, 12, 22, 12, 16,6]
          }
        ],
        chart: {
          height: 350,
          width: screen.width * 0.834,
          type: "line"
        },
        stroke: {
          width: [0, 4]
        },
        title: {
          text: "Procesos por dependencia",
          align: "center",
          style: {
            fontWeight: 1
          }
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        // labels: ["1147","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","u","v","w","x","y","z"],
        labels: this.dataProcesosXdependencia_centro_gestor,
        xaxis: {
          type: "category"
        },
        yaxis: [
          {
            title: {
              style: {
                fontWeight: 1
              },
              text: "Valor Contratos"
            }
          },
          {
            opposite: true,
            title: {
              style: {
                fontWeight: 1
              },
              text: "Cantidad Contratos"
            }
          }
        ]
      };
    } else if (id == 8) {
      this.chartOptionsProcesosXasociacion = {
        series: this.arrayQuantityAsociacion,
        chart: {
          width: 500,
          type: "donut"
        },
        title: {
          text: "Procesos por asociacion",
          align: "center",
          style: {
            fontWeight: 1
          }
        },
        labels: this.arrayNameAsociacion,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 100
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
    } else if (id == 9) {
      this.chartOptionsProcesosXreferencia = {
        series: this.arrayQuantityReferencia,
        chart: {
          width: 500,
          type: "donut"
        },
        theme: {
          mode: 'light',
          palette: 'palette2',
        },
        title: {
          text: "Procesos por referencia",
          align: "center",
          style: {
            fontWeight: 1
          }
        },
        labels: this.arrayNameReferencia,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 100
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

  getDataDashboardDepen(id: any) {
    let centroGestor = this.dashboardForm.controls['centroGestor'].value;
    let fechaInicio = this.dashboardForm.controls['fechaInicio'].value;
    let fechaTermino = this.dashboardForm.controls['fechaTermino'].value;
    fechaInicio = moment(fechaInicio).format('YYYY-MM-DD');
    fechaTermino = moment(fechaTermino).format('YYYY-MM-DD');
    this.secopService.getDataDashboardDepen(btoa(this.TOKEN), centroGestor, fechaInicio, fechaTermino).subscribe((response: any) => {
      if (response.Status != 'Ok') {
        utilidades.showAlert('No se encontraron registros!', 'error');
      } else {
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

  getDataLineChart() {
    const centro_gestor = this.reportesXmesForm.get('centroGestor')?.value != null ? this.reportesXmesForm.get('centroGestor')?.value : '';
    const fechaInicio = this.reportesXmesForm.get('fechaInicioXmes')?.value != null ? this.reportesXmesForm.get('fechaInicioXmes')?.value : '';
    const fechaTermino = this.reportesXmesForm.get('fechaTerminoXmes')?.value != null ? this.reportesXmesForm.get('fechaTerminoXmes')?.value : '';
    this.secopService.getDataLineChart(this.tokenEncrypt, centro_gestor, fechaInicio, fechaTermino).subscribe(async (response: any) => {
      this.arrayData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (response.Status != 'Ok') {
        showAlert('No se encontraron registros', 'warning');
      } else {
        // showAlert('Filtro aplicado correctamente','success');
        this.dataProcesosXmes = response.Values.ResultFields;
        this.dataProcesosXmes.forEach((e: any) => {
          switch (e.mes_inicio) {
            case 1:
              this.arrayData[0]++;
              break;
            case 2:
              this.arrayData[1]++;
              break;
            case 3:
              this.arrayData[2]++;
              break;
            case 4:
              this.arrayData[3]++;
              break;
            case 5:
              this.arrayData[4]++;
              break;
            case 6:
              this.arrayData[5]++;
              break;
            case 7:
              this.arrayData[6]++;
              break;
            case 8:
              this.arrayData[7]++;
              break;
            case 9:
              this.arrayData[8]++;
              break;
            case 10:
              this.arrayData[9]++;
              break;
            case 11:
              this.arrayData[10]++;
              break;
            case 12:
              this.arrayData[11]++;
              break;
          }
        });
      }
      this.infoProcess(5);
    });
  }

  getDataProcesosXestadoChart() {
    const centro_gestor = this.reportesXestadoForm.get('centroGestor')?.value != null ? this.reportesXestadoForm.get('centroGestor')?.value : '';
    let fechaInicio = this.reportesXestadoForm.get('fechaInicioXestado')?.value != null ? this.reportesXestadoForm.get('fechaInicioXestado')?.value : '';
    let fechaTermino = this.reportesXestadoForm.get('fechaTerminoXestado')?.value != null ? this.reportesXestadoForm.get('fechaTerminoXestado')?.value : '';
    fechaInicio = (fechaInicio == '') ? '' : moment(fechaInicio).format("YYYY-MM-DD");
    fechaTermino = (fechaTermino == '') ? '' : moment(fechaTermino).format("YYYY-MM-DD");
    this.secopService.getDataProcesosXestadoChart(this.tokenEncrypt, centro_gestor, fechaInicio, fechaTermino).subscribe((response: any) => {
      if (response.Status != 'Ok') {
        utilidades.showAlert('No se encontraron registros', 'warning');
      } else {
        let data = response.Values.ResultFields;
        let arrayData_estado: any[] = [];
        let arrayData_valor: any[] = [];
        let arrayData_cantidad: any[] = [];
        data.map((r: any) => {
          arrayData_estado.push(r.ESTADO);
          arrayData_valor.push(r.VALOR);
          arrayData_cantidad.push(r.CANTIDAD);
        });
        this.dataProcesosXestado_estado = arrayData_estado;
        this.dataProcesosXestado_valor = arrayData_valor;
        this.dataProcesosXestado_cantidad = arrayData_cantidad;
      }
      this.infoProcess(6);
    });
  }

  getDataProcesosXdependenciaChart() {
    let fechaInicio = this.reportesXdependenciaForm.get('fechaInicioXdependencia')?.value != null ? this.reportesXdependenciaForm.get('fechaInicioXdependencia')?.value : '';
    let fechaTermino = this.reportesXdependenciaForm.get('fechaTerminoXdependencia')?.value != null ? this.reportesXdependenciaForm.get('fechaTerminoXdependencia')?.value : '';
    fechaInicio = fechaInicio == '' ? '' : moment(fechaInicio).format("YYYY-MM-DD");
    fechaTermino = fechaTermino == '' ? '' : moment(fechaTermino).format("YYYY-MM-DD");
    this.secopService.getDataProcesosXdependenciaChart(this.tokenEncrypt, fechaInicio, fechaTermino).subscribe((response: any) => {
      // console.log(response);
      this.dataProcesosXdependencia_cantidad = [];
      this.dataProcesosXdependencia_valor = [];
      this.dataProcesosXdependencia_centro_gestor = [];
      if (response.Status != 'Ok') {
        utilidades.showAlert('No se encontraron registros', 'warning');
      } else {
        let data = response.Values.ResultFields;
        let arrayData_cantidad: any[] = [];
        let arrayData_valor: any[] = [];
        let arrayData_centro_gestor: any[] = [];
        data.map((r: any) => {
          arrayData_cantidad.push(r.CANTIDAD);
          arrayData_valor.push(r.VALOR);
          arrayData_centro_gestor.push(r.CENTRO_GESTOR);
        });
        this.dataProcesosXdependencia_cantidad = arrayData_cantidad;
        this.dataProcesosXdependencia_valor = arrayData_valor;
        this.dataProcesosXdependencia_centro_gestor = arrayData_centro_gestor;
      }
      this.infoProcess(7);
    });
  }

  getDataCuadrosEstado() {
    const centro_gestor = this.ROL == 4 ? '' : this.centroGestor;
    this.secopService.getDataCuadrosEstado(this.tokenEncrypt, centro_gestor).subscribe((response: any) => {
      const dataResponse = response.Values.ResultFields;
      // console.log(dataResponse);
      // console.log(dataResponse[0].CANTIDAD);
      this.procesos_abiertos! = dataResponse[0].CANTIDAD;
      this.procesos_espera! = dataResponse[1].CANTIDAD;
      this.procesos_vencen_hoy = dataResponse[2].CANTIDAD;
      this.procesos_vencidos! = dataResponse[3].CANTIDAD;

      // let data = response.Values.ResultFields;
      // let arrayData_cantidad: any[] = [];
      // let arrayData_valor: any[] = [];
      // let arrayData_centro_gestor: any[] = [];
      // data.map((r: any) => {
      //   arrayData_cantidad.push(r.CANTIDAD);
      //   arrayData_valor.push(r.VALOR);
      //   arrayData_centro_gestor.push(r.CENTRO_GESTOR);
      // });
      // this.dataProcesosXdependencia_cantidad = arrayData_cantidad;
      // this.dataProcesosXdependencia_valor = arrayData_valor;
      // this.dataProcesosXdependencia_centro_gestor = arrayData_centro_gestor;
      // this.infoProcess(7);
    });
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<any>, option: number) {
    const ctrlValue = this.fechaInicial.value;
    ctrlValue.year(normalizedYear.year());
    let date = moment(ctrlValue).format('YYYY-MM-DD');
    if (option == 1) {
      this.fechaInicial.setValue(ctrlValue);
      this.reportesXmesForm.get('fechaInicioXmes')?.setValue(date);
    } else if (option == 2) {
      this.fechaTerminal.setValue(ctrlValue);
      this.reportesXmesForm.get('fechaTerminoXmes')?.setValue(date);
    }
    datepicker.close();
  }

  getDataAsociacion() {
    let fechaInicio = this.reporte4FormAsociacion.get('fechaInicio')?.value != null ? this.reporte4FormAsociacion.get('fechaInicio')?.value : '';
    let fechaTermino = this.reporte4FormAsociacion.get('fechaTermino')?.value != null ? this.reporte4FormAsociacion.get('fechaTermino')?.value : '';
    let centroGestor  = this.reporte4FormAsociacion.get('centroGestor')?.value != null ? this.reporte4FormAsociacion.get('centroGestor')?.value : '';
    fechaInicio = fechaInicio == '' ? '' : moment(fechaInicio).format("YYYY-MM-DD");
    fechaTermino = fechaTermino == '' ? '' : moment(fechaTermino).format("YYYY-MM-DD");

    this.secopService.getDataAsociacionReferencia(this.tokenEncrypt, 'ASOCIACION', fechaInicio, fechaTermino, centroGestor).subscribe((response: any) => {
      this.arrayNameAsociacion = [];
      this.arrayQuantityAsociacion = [];
      if (response.Status == 'Ok') {
        this.dataSourceProcesosXasociacion = response.Values.ResultFields;
        for (let i = 0; i < response.Values.ResultFields.length; i++) {
          this.arrayNameAsociacion.push(response.Values.ResultFields[i].ASOCIACION);
          this.arrayQuantityAsociacion.push(response.Values.ResultFields[i].CANTIDAD);
        }
      } else {
        utilidades.showAlert('No se encontraron registros', 'warning');
      }
      this.infoProcess(8);
    });
  }

  getDataReferencia() {
    let fechaInicio = this.reporte4FormReferencia.get('fechaInicio')?.value != null ? this.reporte4FormReferencia.get('fechaInicio')?.value : '';
    let fechaTermino = this.reporte4FormReferencia.get('fechaTermino')?.value != null ? this.reporte4FormReferencia.get('fechaTermino')?.value : '';
    let centroGestor = this.reporte4FormReferencia.get('centroGestor')?.value != null ? this.reporte4FormReferencia.get('centroGestor')?.value : '';
    fechaInicio = fechaInicio == '' ? '' : moment(fechaInicio).format("YYYY-MM-DD");
    fechaTermino = fechaTermino == '' ? '' : moment(fechaTermino).format("YYYY-MM-DD");

    this.secopService.getDataAsociacionReferencia(this.tokenEncrypt, 'REFERENCIA', fechaInicio, fechaTermino, centroGestor).subscribe((response: any) => {
      this.arrayNameReferencia = [];
      this.arrayQuantityReferencia = [];
      if (response.Status == 'Ok') {
        this.dataSourceProcesosXreferencia = response.Values.ResultFields;
        for (let i = 0; i < response.Values.ResultFields.length; i++) {
          this.arrayNameReferencia.push(response.Values.ResultFields[i].REFERENCIA);
          this.arrayQuantityReferencia.push(response.Values.ResultFields[i].CANTIDAD);
        }
      } else {
        utilidades.showAlert('No se encontraron registros', 'warning');
      }
      this.infoProcess(9);
    });
  }
}
