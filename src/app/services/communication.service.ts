import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  public sidebarCollapse = new BehaviorSubject<boolean>(false);
  public mainFilterData = new BehaviorSubject<any>({});
  public dataAirlineFlightBeverageOriginal = new BehaviorSubject<any>([]);
  public dataAirlineBeverageOriginal = new BehaviorSubject<any>([]);
  public dataAirlineFlightBeverage = new BehaviorSubject<any>([]);
  public dataAirlineBeverage = new BehaviorSubject<any>([]);
  public filterOptions = new BehaviorSubject<any>([]);
  public apiDataLoading = new BehaviorSubject<boolean>(false)

  /*summary date*/
  public totalFlight:number=0;
  public totalDrawers:number=0;
  public totalBoardedQuantity:number=0;
  public totalInboundQuantity:number=0;
  public totalBoardedWeight:number=0;
  public totalInboundWeight:number=0;

  /* extra Cost no Flight*/
  public totalDrawersWithFlight:number=0;
 
  constructor() { }
  
  setStartDate(date:any){
    date.setMonth(date.getMonth() - 6);
    // date.setDate(1);
    return date;
  }

}
