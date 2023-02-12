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
    })


    this.communication.mainFilterData.subscribe((res: any) => {
      this.min_date = res["start_date"];
      this.max_date = res["end_date"];
      this.filterform.patchValue({ start_date: this.min_date, end_date: this.max_date });
    })

    this.filterform.valueChanges.subscribe((res: any) => {    
      let data = JSON.parse(JSON.stringify(this.airlineFltBevDataListOriginal));     
      // data = data.filter((d: any) => moment(d.departure).format('DD/MM/YYYY') >= moment(res["start_date"]).format('DD/MM/YYYY'));
      // data = data.filter((d: any) => moment(d.departure).format('DD/MM/YYYY') <= moment(res["end_date"]).format('DD/MM/YYYY'));
      // data.forEach((d: any) =>d.items = (d.items.filter((s: any) => s.name == res["product"])));
      this.communication.dataAirlineFlightBeverage.next(data);     
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
      week: ["tuesday"],
      start_date: [new Date(d.setDate(1))],
      end_date: [new Date()],
      time: [""]
    })
  }

}
