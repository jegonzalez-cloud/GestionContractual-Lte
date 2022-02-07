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
  private subjectFillFields = new Subject<any>();
  private modals: any[] = [];

  constructor(private http:HttpClient) { }

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

  sendClickEventsubjectFillFields(){
    this.subjectFillFields.next();
  }

  getClickEventsubjectFillFields():Observable<any>{
    return this.subjectFillFields.asObservable();
  }
}
