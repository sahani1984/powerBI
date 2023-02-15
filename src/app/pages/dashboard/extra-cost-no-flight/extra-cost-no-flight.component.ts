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
  showLoader:boolean=false;
  Highcharts: typeof Highcharts = Highcharts;
  columnChartOptions!: Highcharts.Options;
  columnChartData:any[]=[];
  TotalOBSCostToCarryData:any[]=[];
  fuelCTCnoFlightdata:any[]=[];
  constructor(public communication:CommunicationService,
    ) {
    this.communication.deltaNoFlightLoading.subscribe((res:any)=> this.showLoader = res);
    this.communication.dataAirlineBeverage.subscribe((res:any)=>{
      this.fuelCTCnoFlightdata = this.createFuelCTCnoFlightdata(res);
      this.createColumnChart(this.fuelCTCnoFlightdata); 
      console.log(res);
    })   
  }
  ngOnInit(): void {
  }
   
  createColumnChart(data:any[]){
    this.columnChartOptions = {
      chart: {
        type: 'bar',
        inverted: true,
        height:465  ,
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
        },
        margin:0
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
          pointWidth:18,
         },      
      },
      credits:{enabled:false},
    series:data
    }
  }

  createFuelCTCnoFlightdata(data:any){
    let dataLists = JSON.parse(JSON.stringify(data));
    let productItems = [...new Set(dataLists.map((m:any)=>m.label))];
    let fuelCTCdata:any=[];
    productItems.forEach((item:any)=>{
        let data = dataLists.filter((m:any)=> m.label.toLowerCase() == item.toLowerCase())
        .map((n:any)=> (n.count * n.weight.value) * 0.07).reduce((m: any, n: any) => m + n, 0);
        data = Number(data.toFixed(1))
        fuelCTCdata.push([item, data]);
    })  
    return [{color:"#118dff", data:fuelCTCdata}] 
  }
  // createColumnChartData(){
  //   return  [{     
  //     color:"#118dff",
  //     data: [
  //         ['Diet Coke',3266],
  //         ['Coke', 2891],
  //         ['Ginger Ale', 2613],
  //         ['Sprite', 1779],
  //         ['Coke Zero', 1202],
  //         ['Red Wine', 822],
  //         ['Tip Top Margarita',750],
  //         ['Woodford Whiskey', 620],
  //         ['Do Nord Vodka', 508],
  //         ['Bombay Sapphire Gin', 498],
  //         ['Tip Top Old Fashioned', 485],
  //         ['Jack Daniels Whiskey', 236],
  //         ['Bacardi Rum', 218]                 
  //     ],
     
  // }]
  // }

  
}
