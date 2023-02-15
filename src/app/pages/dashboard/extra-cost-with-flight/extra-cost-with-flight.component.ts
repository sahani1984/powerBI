import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import * as moment from 'moment';
import { CommunicationService } from 'src/app/services/communication.service';
highcharts3D(Highcharts);

@Component({
  selector: 'app-extra-cost-with-flight',
  templateUrl: './extra-cost-with-flight.component.html',
  styleUrls: ['./extra-cost-with-flight.component.scss']
})
export class ExtraCostWithFlightComponent implements OnInit {
  title_data:string="Extra Cost With Flight";
  showLoader:boolean=false;
  Highcharts: typeof Highcharts = Highcharts;
  rateChartOptions!: Highcharts.Options;
  carryChartOptions!: Highcharts.Options;
  tradeChartOptions!: Highcharts.Options;
  rateChartData:  any[] = [];
  carryChartData:  any[] = [];
  tradeChartData:  any[] = [];
  fuelCTCWithFlight:any=[];

  constructor(public communication:CommunicationService) {
    this.rateChartData = this.createRateChartData(); 
    this.tradeChartData = this.createTradeChartData();
    this.communication.apiDataLoading.subscribe((res:any)=> this.showLoader = res);
   this.communication.dataAirlineFlightBeverage.subscribe((res:any)=>{
       if(res && res.length){
         this.makeData(res);
          this.fuelCTCWithFlight = this.fuelCTCWithFlightProduct(res);
          this.createcarryChart (this.fuelCTCWithFlight['data'], this.fuelCTCWithFlight['category']);
       }
     })
  }

  ngOnInit(): void {
    this.createTradeChart(this.tradeChartData);
    this.createrateChart(this.rateChartData);
  }

  makeData(data:any){
   
      let dataList: any = JSON.parse(JSON.stringify(data));
      let dates = [...new Set(dataList.map((d: any) => d.departure.split('T')[0]))];  
      let labourcost:any=[];
      dates.forEach((item: any) => {
        let l = dataList.filter((x: any) => x.departure.split('T')[0] == item).map((d:any)=> d.drawers).map((d:any)=> d.inbound *0.62).reduce((r: any, y: any) => r + y, 0); 
        labourcost.push(Number(l.toFixed(1)));
      })
      let  dateInshort = dates.map((d:any)=> moment(d).format('MMM DD')); 
      let chartData = [
        { name: 'Labor Cost', data: labourcost, color: "#12239e" },    
      ]
      return { category: dateInshort, data: chartData }
    }    
  
  createrateChart(data:any[]){
    this.rateChartOptions = {
      chart: {
        type: 'bar',
        inverted: true,
        scrollablePlotArea: {
            minHeight: 250        
        },
        height:250,
        marginRight: 30,
      
    },
     title: {
      text: 'Consumption/Pax by Product',
       align: 'left'

   },
   xAxis: {
    categories: ['Ginger Ale', 'Coke', 'Du Nord Vod..', 'Diet Coke', 'Woodford W..',
    'Tip Top Marg..', 'Red Wine', 'Bacardi Rum', 'Jack Daniles', 'Sprit'],
    type: 'category',
    title: {text: 'Product'},
    labels: {
        rotation: 0,
    }
},
yAxis: {
    min: 0,
    title: {
        text:'Consumption/Pax'
    }
},
   plotOptions: {
    bar: {
      dataLabels: {
        enabled: true
      },
      pointWidth:14,
      groupPadding:.1
     },      
  },
  credits:{enabled:false},
   series:data
    }
  }
   createcarryChart(data:any[], category:any[]){
    this.carryChartOptions = {
      chart: {
        type: 'bar',
        inverted: true,
        scrollablePlotArea: {
            minHeight: 360        
        },
        height:250,
        marginRight: 30
    },
     title: {
       text: 'Total OBS Cost to Carry',
       align: 'left'
   },
   xAxis: {
    categories: category,
    type: 'category',
    title: {text: 'Product'},
    labels: {
        rotation: 0,
    }
},
yAxis: {
    min: 0,
    title: {
        text:  ''
    }
},
   plotOptions: {
    bar: {
      dataLabels: {
        enabled: false
      },
      pointWidth:14,
      groupPadding:.1
     },      
  },
  credits:{enabled:false},
   series:data
    }
  }
   createTradeChart(data:any[]){
    this.tradeChartOptions =  {
      chart: {
        type: "column",
        height:193,
        
    },
        title: {
            text: "Consumption/Pax by Flight #",
            align:"left"
          },
          lang: {
            thousandsSep: ","
          },
          
          xAxis: [
            {
              categories: data[0],
              labels: {
                rotation: -45
              },
             
            }
          ],
          yAxis: [
            {          
              title: {
                text: ''
              }
            },
           
          ],
          plotOptions: {
            column: {
              dataLabels: {
                enabled: true
              },
              pointWidth:24,
              groupPadding:.1
             },      
          },
        series: [
            {
              name: "Flight",
              color: "#0071A7",
              type: "column",
              data: data[1],           
               },
           
          ],
        tooltip: {
            shared: true
          },
          legend: {
            backgroundColor: "#ececec",
            shadow: true
          },
          credits: {
            enabled: false
          }
  }}
    
  fuelCTCWithFlightProduct(data:any){   
    let dataList = JSON.parse(JSON.stringify(data));   
    let productItem = [...new Set(dataList.map((d:any)=> d.items).flat(1).map((m:any)=> m.name))];
    let fuelcost: any = [];      
    productItem.forEach((item: any) => {
     let x =  dataList.map((a:any)=> a.items).flat(1).filter((b:any)=> b.name == item)
     .map((c:any)=> (c.weight.value * c.quantity.inbound)* 0.07).reduce((r: any, y: any) => r + y, 0);
       fuelcost.push(Number(x.toFixed(1)));     
    })
   let chartdata =  [{name: 'Fuel CTC with Flight', color:"#118dff",data: fuelcost}]
   return {data:chartdata, category:productItem};
  }

  createTradeChartData(){
    return [
        [865,25,150,36,98,105,119,236,450,146,50,202,350,66,210,256,
          352,9,47,274,35,308,125],
        [0.35,0.34,0.88,0.12,0.31,0.35,0.13,0.00,0.73,0.62,
          0.43,0.29,0.37,0.10,0.00,0.68,0.87,0.28,0.43,0.55,0.29,0.16,0.87],
    ]
  }
  createRateChartData(){
    return [{
      type: 'bar',
        name: 'Unemployed',
        color:"#118dff",
        data: [0.06, 0.04, 0.033, 0.032, 0.031, 0.03, 0.03, 0.03, 0.025],
        showInLegend: false
    }]
  }
  createCarryChartData(){
    return [{
      type: 'bar',
        name: 'Unemployed',
        color:"#118dff",
        data: [5412, 4977, 4730, 4437, 3947, 3707, 4143, 3609,
            3311, 3072],
        showInLegend: false
    }]
  }

 
}
 



 




