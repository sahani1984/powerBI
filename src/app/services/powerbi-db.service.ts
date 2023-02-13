import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import { Apis } from '../shared/apis';
@Injectable({
  providedIn: 'root'
})
export class PowerbiDbService {
  private clientId = "3f6a2bc4-d190-411f-a41c-21c6d0e54855"; 
  constructor(private http:HttpClient) { }

  signIn(data:any):Observable<any>{
    return this.http.post<any>(Apis.login, data);
  }

  getClientLists(data:any):Observable<any>{
    return this.http.post<any>(Apis.clientListing, data);
  } 

  getUserLists(data:any):Observable<any>{
    return this.http.post<any>(Apis.userListing,data);
  }

  register(data:any):Observable<any>{
    return this.http.post<any>(Apis.register,data);
  }

  singOut(data:any):Observable<any>{
    return this.http.post<any>(Apis.signOut,data);
  }

  enabled(data:any):Observable<any>{
    return this.http.post<any>(Apis.enableuser,data)
  }

  getFlightBeverages(data:any):Observable<any>{
    let queryparams = `/${data.clientId}?startDate=${data.startDate}&endDate=${data.endDate}`
    return this.http.get<any>('http://localhost:3000/match');
  }

  getBeverages(data:any):Observable<any>{
    let queryparams = `/${data.clientId}?startDate=${data.startDate}&endDate=${data.endDate}`
    // return this.http.get<any>(Apis.beverages+queryparams);
    return this.http.get<any>('http://localhost:3000/data');
  }
}
