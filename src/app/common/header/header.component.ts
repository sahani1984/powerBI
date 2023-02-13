
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PowerbiDbService } from 'src/app/services/powerbi-db.service';
import * as moment from 'moment';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  searchform!: FormGroup;
  showMessagesDropdown: boolean = false;
  showUserDropdown: boolean = false;
  sidebarcollapse: boolean = false;
  activeClient: any = "3f6a2bc4-d190-411f-a41c-21c6d0e54855";
  start_date: Date= this.comunicationServices.setStartDate(new Date());
  end_date: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private comunicationServices: CommunicationService,
    private powerbiDb: PowerbiDbService,
    private router: Router) {
    this.initform();
    this.comunicationServices.sidebarCollapse.subscribe((res: any) => this.sidebarcollapse = res);
    this.searchform.valueChanges.subscribe((res: any) => this.activeClient = res["client"])
  }

  ngOnInit(): void {
    this.clientLists();
    this.getBeverage();
    this.getFlightBeverage();
    this.searchform.valueChanges.subscribe(
      (res: any) =>{
        this.activeClient = res["client"];
        this.start_date = res["start_date"];
        this.end_date = res["end_date"];
        this.comunicationServices.mainFilterData.next(res);
        this.getBeverage();
        this.getFlightBeverage();
      }
    )
  }

  

  clientList: any[] = [];
  clientLists(){
    let obj: any = {};
    obj["data"] = {};
    obj["data"]["serviceEndpoint"] = "/client-listing";
    obj["data"]["serviceRequestType"] = "POST";
    this.powerbiDb.getClientLists(obj).subscribe({
      next: (res: any) => {
        if (res["statusCode"] == 200) {
          this.clientList = res["data"];         
          }
      },
      error: (err) => console.log(err)
    })
  }

  sidebarToggle(){
    this.comunicationServices.sidebarCollapse.next(!this.sidebarcollapse);
  }

  logout(){
    let obj: any = {};
    obj["data"] = {};
    obj["data"]["serviceEndpoint"] = "/sign-out";
    obj["data"]["serviceRequestType"] = "POST";
    this.powerbiDb.singOut(obj).subscribe({
      next: (res: any) => {
        if (res["statusCode"] == 200) {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => console.log(err)
    })
  }

  createFilterOptions(data:any){
    let origin =  [...new Set(data.map((d:any)=> d.origin))];
    let destination = [...new Set(data.map((d:any)=> d.destination))];
    let product = [...new Set(data.map((d:any)=> d.items).flat(1).map((d:any)=> d.name))];
    let flight = [...new Set(data.map((d: any) => d.number))]; 
    let obj:any={};
    obj["origin"]= origin;
    obj["destination"]= destination;
    obj["product"]= product;
    obj["flight"]= flight;
    return obj;
  }

  makeData(data:any){
    console.log(data);
    let datalist = JSON.parse(JSON.stringify(data));
    this.comunicationServices.totalFlight = datalist.length;
    this.comunicationServices.totalDrawers = datalist.map((d:any)=> d.drawers).map((x:any)=> x.inbound).reduce((a:any,b:any)=> a+b);    

     let boardQty:any = [];
     let inboundQty:any=[];
     datalist.forEach((d:any) =>  boardQty.push(...d.items.map((s:any)=> s.quantity).map((m:any)=> m.outbound)));
     datalist.forEach((d:any) =>  inboundQty.push(...d.items.map((s:any)=> s.quantity).map((m:any)=> m.inbound)));
     this.comunicationServices.totalBoardedQuantity = boardQty.reduce((a:any, b:any)=>a+b)
     this.comunicationServices.totalInboundQuantity = inboundQty.reduce((a:any, b:any)=>a+b);

      let boardedWeight:any = [];
      datalist.forEach((d:any) => {
        let outboundQty = d.items.map((s:any)=> s.quantity).map((m:any)=> m.outbound);
        let weight = d.items.map((s:any)=> s.weight).map((m:any)=> m.value);
        let result:any=[];
        outboundQty.forEach((item:any, index:number)=>{
          result.push(Number(item * weight[index]).toFixed(2))
        })  
        boardedWeight.push(...result);   
       });
     this.comunicationServices.totalBoardedWeight =
     boardedWeight.reduce((x:any,y:any)=> Number(x)+ Number(y)).toFixed(0)
    
     let inboundWeight:any = [];
      datalist.forEach((d:any) => {
        let inboundQty = d.items.map((s:any)=> s.quantity).map((m:any)=> m.inbound);
        let weight = d.items.map((s:any)=> s.weight).map((m:any)=> m.value);
        let result:any=[];
        inboundQty.forEach((item:any, index:number)=>{
          result.push(Number(item * weight[index]).toFixed(2))
        })  
        inboundWeight.push(...result);   
       });
     this.comunicationServices.totalInboundWeight  = inboundWeight.reduce((x:any,y:any)=> Number(x)+ Number(y)).toFixed(0);
    
  }

  getBeverage(){
    let obj: any = {};
    obj["startDate"] = moment(this.start_date).format('YYYY-MM-DD');
    obj["endDate"] = moment(this.end_date).format('YYYY-MM-DD');
    obj["clientId"] = this.activeClient;
    this.powerbiDb.getBeverages(obj).subscribe({
      next: (res: any)=>{
        this.comunicationServices.dataAirlineBeverageOriginal.next(res);    
        this.comunicationServices.dataAirlineBeverage.next(res);    
      },
      error: (err) => console.log(err)
    })
  }

  getFlightBeverage(){
    this.comunicationServices.apiDataLoading.next(true);
    let obj: any = {};
    obj["startDate"] = moment(this.start_date).format('YYYY-MM-DD');
    obj["endDate"] = moment(this.end_date).format('YYYY-MM-DD');
    obj["clientId"] = this.activeClient;
    this.powerbiDb.getFlightBeverages(obj).subscribe({
      next: (res: any) => {
        this.makeData(res["match"]);
        this.comunicationServices.apiDataLoading.next(false);   
        this.comunicationServices.filterOptions.next(this.createFilterOptions(res["match"]))    
        this.comunicationServices.dataAirlineFlightBeverageOriginal.next(res["match"]);
        this.comunicationServices.dataAirlineFlightBeverage.next(res["match"]);
        },
      error: (err) => {
        this.comunicationServices.apiDataLoading.next(false);
        console.log(err)
      }
    })
  }

  initform(){
    let d = new Date();
    this.searchform = this.fb.group({
      client: [this.activeClient],
      start_date: [this.start_date],
      end_date: [this.end_date]
    })
    this.comunicationServices.mainFilterData.next(this.searchform.value);
  }
}
