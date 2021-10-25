import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import * as funciones from "../../utils/functions";
import {utils} from "xlsx";
import {TreeSelectModule} from 'primeng/treeselect';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css']
})
export class SampleComponent implements OnInit {

  nodes1!: any[];


  data: any =
    [
      {
        "label": "Documents",
        "data": "Documents Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [{
          "label": "Work",
          "data": "Work Folder",
          "expandedIcon": "pi pi-folder-open",
          "collapsedIcon": "pi pi-folder",
          "children": [{
            "label": "Expenses.doc",
            "icon": "pi pi-file",
            "data": "Expenses Document"
          }, {"label": "Resume.doc", "icon": "pi pi-file", "data": "Resume Document"}]
        },
          {
            "label": "Home",
            "data": "Home Folder",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            "children": [{"label": "Invoices.txt", "icon": "pi pi-file", "data": "Invoices for this month"}]
          }]
      },
      {
        "label": "Pictures",
        "data": "Pictures Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [
          {"label": "barcelona.jpg", "icon": "pi pi-image", "data": "Barcelona Photo"},
          {"label": "logo.jpg", "icon": "pi pi-image", "data": "PrimeFaces Logo"},
          {"label": "primeui.png", "icon": "pi pi-image", "data": "PrimeUI Logo"}]
      },
      {
        "label": "Movies",
        "data": "Movies Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        // "children": [{
        //   "label": "Al Pacino",
        //   "data": "Pacino Movies",
        //   "children": [{"label": "Scarface", "icon": "pi pi-video", "data": "Scarface Movie"}, {
        //     "label": "Serpico",
        //     "icon": "pi pi-video",
        //     "data": "Serpico Movie"
        //   }]
        // },
        //   {
        //     "label": "Robert De Niro",
        //     "data": "De Niro Movies",
        //     "children": [{
        //       "label": "Goodfellas",
        //       "icon": "pi pi-video",
        //       "data": "Goodfellas Movie"
        //     }, {"label": "Untouchables", "icon": "pi pi-video", "data": "Untouchables Movie"}]
        //   }]
      }
    ];


  selectedNode: any;

  constructor() {
  }

  ngOnInit() {
    // this.nodeService.getFiles().then(files => this.nodes1 = files);
    this.nodes1 = this.data;
  }

//
//
// async getCdpData(){
//     await funciones.getCdpData('1158','5500002528');
//     let monto = localStorage.getItem('prueba');
//     await localStorage.removeItem('prueba');
//     console.log(monto);
//   }
}
