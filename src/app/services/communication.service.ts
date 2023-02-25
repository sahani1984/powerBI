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
  public apiDataLoading = new BehaviorSubject<boolean>(false);
  public deltaNoFlightLoading = new BehaviorSubject<boolean>(false);


  /*AIRLINE FLIGHT BEVERAGE INFO*/
  public totalFlight: number = 0;
  public totalDrawers: number = 0;
  public totalBoardedQuantity: number = 0;
  public totalInboundQuantity: number = 0;
  public totalBoardedWeight: number = 0;
  public totalInboundWeight: number = 0;
  public WeightOfProductReturnToKitchen: number = 0;
  public FuelCTCwithFlight: number = 0;
  public Emissions_lbs_withFlight: number = 0;
  public LaborCost: number = 0;


  /*AIRLINE BEVERAGE INFO*/
  public totalDrawersWithFlight: number = 0;
  public weightOfProductReturnToKitchenNoFlight: number = 0;
  public fuelCTCnoFlight: number = 0;
  public emission_lbs_noFlight: number = 0;
  public labourCostWithoutFlight: number = 0;
  public totalDrawersNoFlight: number = 0;

  public currentActiveRoute:any="";


  constructor() { }




  setStartDate(date: any) {
    date.setMonth(date.getMonth() - 1)
    date.setDate(1);
    return date;
  }

}
