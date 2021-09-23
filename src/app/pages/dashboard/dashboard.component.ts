import { Component, OnInit } from '@angular/core';
import {ChartType, LegendItem} from "chart.js";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public emailChartType!: ChartType;
  public emailChartData: any;
  public emailChartLegendItems!: LegendItem[];

  public hoursChartType!: ChartType;
  public hoursChartData: any;
  public hoursChartOptions: any;
  public hoursChartResponsive!: any[];
  public hoursChartLegendItems!: LegendItem[];

  public activityChartType!: ChartType;
  public activityChartData: any;
  public activityChartOptions: any;
  public activityChartResponsive!: any[];
  public activityChartLegendItems!: LegendItem[];
  constructor() { }

  ngOnInit(): void {
  }

}
