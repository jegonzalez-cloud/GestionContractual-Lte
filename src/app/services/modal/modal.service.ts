import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  apiUrl: string = 'http://localhost:3000';
  private subject = new Subject<any>();
  private subjectGetDataProcess = new Subject<any>();
  private subjectDataBusqueda = new Subject<any>();
  private subjectDataAutorizaciones = new Subject<any>();
  private subjectFillFields = new Subject<any>();

  constructor() { }

  sendClickEvent(){
    this.subject.next();
  }

  getClickEvent():Observable<any>{
    return this.subject.asObservable();
  }

  sendClickEventGetDataProcess(){
    this.subjectGetDataProcess.next();
  }

  getClickEventGetDataProcess():Observable<any>{
    return this.subjectGetDataProcess.asObservable();
  }

  sendClickEventDataBusqueda(){
    this.subjectDataBusqueda.next();
  }

  getClickEventDataBusqueda():Observable<any>{
    return this.subjectDataBusqueda.asObservable();
  }

  sendClickEventDataAutorizaciones(){
    this.subjectDataAutorizaciones.next();
  }

  getClickEventDataAutorizaciones():Observable<any>{
    return this.subjectDataAutorizaciones.asObservable();
  }

  sendClickEventsubjectFillFields(){
    this.subjectFillFields.next();
  }

  getClickEventsubjectFillFields():Observable<any>{
    return this.subjectFillFields.asObservable();
  }
}
