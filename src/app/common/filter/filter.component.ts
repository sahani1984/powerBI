import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommunicationService } from 'src/app/services/communication.service';
import * as moment from 'moment';

@Component({
  selector: 'data-filter-form',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  isCardCollapse: boolean = false;
  filterform!: FormGroup;
  min_date: Date = new Date(new Date().setDate(1));
  max_date: Date = new Date();
  productList: any[] = [];
  originList: any[] = [];
  destinationList: any[] = [];
  flightList:any[]=[];
  airlineFltBevDataListOriginal:any[]=[];
  alirlineBevDataListOriginal:any[]=[];



  @Input('filterCase') filter_case:any;
  constructor(
    private fb: FormBuilder, 
    private communication: CommunicationService) {       
    this.initform();   
    this.communication.dataAirlineFlightBeverageOriginal.subscribe((res:any)=> this.airlineFltBevDataListOriginal = res); 
    this.communication.dataAirlineBeverageOriginal.subscribe((res:any)=> this.alirlineBevDataListOriginal = res);
          
    this.communication.filterOptions.subscribe((res: any) => {
      this.productList = res["product"];
      this.originList = res["origin"];
      this.destinationList = res["destination"];
      this.flightList = res["flight"];
    })


    this.communication.mainFilterData.subscribe((res: any) => {
      this.min_date = res["start_date"];
      this.max_date = res["end_date"];
      this.filterform.patchValue({ start_date: this.min_date, end_date: this.max_date });
    })

    this.filterform.valueChanges.subscribe((res: any) => {    
      let data = JSON.parse(JSON.stringify(this.airlineFltBevDataListOriginal));  
      console.log(data);  
      let result: any[] = []
      result = data.filter((item: any) => new Date(item.departure).getTime() >= res["start_date"].getTime());
      result = result.filter((item: any) => new Date(item.departure).getTime() <= res["end_date"].getTime());
      if (res['week'] !== "") {
        result = result.filter((item: any) => moment(item.departure).format('dddd').toLowerCase() === res["week"].toLowerCase())
      }
      if (res['product'] !== "") {
        result.forEach((item: any) => item.items = item.items.filter((d: any) => d.name.toLowerCase() == res['product'].toLowerCase()));
      }
      if (res['flight'] !== "") {
        result = result.filter((item: any) => item.number === res["flight"]);
      }     
    
      this.communication.dataAirlineFlightBeverage.next(result);     
    })
  }

  ngOnInit(): void {
    this.showFilterControls(this.filter_case);
  }



  showProductfilter:boolean=false;
  showOriginfilter:boolean=false;
  showDestinationfilter:boolean=false;
  showFlightfilter:boolean=false;
  showDayOfWeekfilter:boolean=false;
  showFilterControls(caseType:any){
      if(caseType!=='byday') this.showProductfilter = true; 
      if(caseType!=='noflight') this.showDayOfWeekfilter = true;      
      if(caseType==='byday') this.showDestinationfilter = true;     
      if((caseType == 'byday' ) || (caseType == 'details')){
        this.showOriginfilter=true; 
        this.showFlightfilter = true;      
      }         
       this.filterform.patchValue({product:"",origin:"", destinaton:"", flight:""})
  }


  initform() {
    let d = new Date();
    this.filterform = this.fb.group({
      product: [""],
      origin: [""],
      destinaton: [""],
      flight: [""],
      week: [""],
      start_date: [new Date(d.setDate(1))],
      end_date: [new Date()],
      time: [""]
    })
  }

}
