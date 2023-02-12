import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import { CommunicationService } from 'src/app/services/communication.service';
highcharts3D(Highcharts);

@Component({
  selector: 'app-extra-cost-no-flight',
  templateUrl: './extra-cost-no-flight.component.html',
  styleUrls: ['./extra-cost-no-flight.component.scss']
})
export class ExtraCostNoFlightComponent implements OnInit {
  title_data:string="Extra Cost No Flight";
  isCardCollapse:boolean=false;
  cardCollapse:boolean=false
  Highcharts: typeof Highcharts = Highcharts;
  columnChartOptions!: Highcharts.Options;
  columnChartData:any[]=[];
  extra_cost_no!:FormGroup;
  TotalOBSCostToCarryData:any[]=[];

  constructor(private fb:FormBuilder,
    public communication:CommunicationService) {
    this.columnChartData = this.createColumnChartData();
    this.initform();
    this.communication.dataAirlineFlightBeverage
    .subscribe((res:any)=>{
      if(res && res.length){
  let CostCarry = this.TotalOBSCostToCarry(res);
  this.TotalOBSCostToCarryData;
  this.createColumnChart(this.TotalOBSCostToCarryData);
      }
    })
   }

// makeData(data:any){
//   let datalist = JSON.parse(JSON.stringify(data));
//   this.communication.totalDrawersNoFlight =datalist.length;
//   console.log(data);
// }
 
TotalOBSCostToCarry(data:any){
let CostData =JSON.parse(JSON.stringify(data));
let CostDataList =CostData.map((item:any)=>item.items).flat(1);
let CostCarry=[...new Set(CostDataList.map((a:any)=>a.name))];
let costCarry:any=[];
CostCarry.forEach((item:any)=>{
  let CostValue =CostDataList.filter((d:any)=>d.name==item).map((e:any)=>e.cost).map((f:any)=>f.value).reduce((g:any,h:any)=>g+h,0);
  costCarry.push([item,CostValue]);
})
let outbound ={
  name:"Total Boarded Weight",
  data:this.createColumnChartData,
  color:"#118dff"
}
return outbound;
}
  createColumnChart(data:any[]){
    this.columnChartOptions = {
      chart: {
        type: 'bar',
        inverted: true,
    },
    title: {
        text: 'Total OBS cost to carry',
        align:"left"
    },
   
    xAxis: {
        type: 'category',
        title: {
          text: 'Product'
      },
        labels: {
            rotation: 0,
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Fuel CTC No Flight #'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: 'Total OBS: <b>{point.y:.1f} millions</b>'
    },
    plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            format: '${point.y:,.1f}',
            align:"left"
          },
          pointWidth:20,
         },      
      },
      credits:{enabled:false},
    series:data
    }
  }
  createColumnChartData(){
    return  [{
      name: 'Population',
      color:"#118dff",
      data: [
          ['Diet Coke',3266],
          ['Coke', 2891],
          ['Ginger Ale', 2613],
          ['Sprite', 1779],
          ['Coke Zero', 1202],
          ['Red Wine', 822],
          ['Tip Top Margarita',750],
          ['Woodford Whiskey', 620],
          ['Do Nord Vodka', 508],
          ['Bombay Sapphire Gin', 498],
          ['Tip Top Old Fashioned', 485],
          ['Jack Daniels Whiskey', 236],
          ['Bacardi Rum', 218]                 
      ],
     
  }]
  }

  
  ngOnInit(): void {
    this.createColumnChart(this.columnChartData);  
    }
    initform(){
      let d = new Date();
      this.extra_cost_no = this.fb.group({
        product:[""],
        week:["tuesday"],
        start_date:[new Date(d.setDate(1))],
        end_date:[new Date()],
        time:[""]
      })
    }
}
