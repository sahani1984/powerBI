import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import { CommunicationService } from 'src/app/services/communication.service';
highcharts3D(Highcharts);

@Component({
  selector: 'app-extra-cost-with-flight',
  templateUrl: './extra-cost-with-flight.component.html',
  styleUrls: ['./extra-cost-with-flight.component.scss']
})
export class ExtraCostWithFlightComponent implements OnInit {
  isCardCollapse:boolean=false;
  cardCollapse:boolean=false;
  title_data:string="Extra Cost With Flight"
  Highcharts: typeof Highcharts = Highcharts;
  rateChartOptions!: Highcharts.Options;
  rateChartData:  any[] = [];
  carryChartOptions!: Highcharts.Options;
  carryChartData:  any[] = [];
  tradeChartOptions!: Highcharts.Options;
  tradeChartData:  any[] = [];
  extra_cost_with_flight!:FormGroup;

  constructor(private fb:FormBuilder,
    public communication:CommunicationService) {
    this.rateChartData = this.createRateChartData(); 
    this.carryChartData = this.createCarryChartData(); 
    this.tradeChartData = this.createTradeChartData();
  this.initform();
  this.communication.dataAirlineFlightBeverage
    //  .subscribe((res:any)=>{
    //    if(res && res.length){
    //      this.makeData(res);
    //    }
    //  })
  }

  ngOnInit(): void {
    this.createTradeChart(this.tradeChartData);
    this.createrateChart(this.rateChartData);
    this.createcarryChart(this.carryChartData);
  }

  makeData(data:any){
      let datalist = JSON.parse(JSON.stringify(data));
      this.communication.totalDrawersWithFlight = datalist.map((d:any)=> d.drawers)
      .map((x:any)=> x.inbound).reduce((a:any,b:any)=> a+b);    
    }
  

  initform(){
    let d = new Date();
    this.extra_cost_with_flight = this.fb.group({
      product:[""],
      week:["tuesday"],
      start_date:[new Date(d.setDate(1))],
      end_date:[new Date()],
      time:[""],
    })

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
   createcarryChart(data:any[]){
    this.carryChartOptions = {
      chart: {
        type: 'bar',
        inverted: true,
        scrollablePlotArea: {
            minHeight: 250        
        },
        height:250,
        marginRight: 30
    },
     title: {
       text: 'Total OBS Cost to Carry',
       align: 'left'
   },
   xAxis: {
    categories: [ 'Diet Coke','Coke','Ginger Ale', 'Sprit','Red Wine','Tip Top Marg..', 'Woodford W..',
       'Coke Zero','Tip Top Old Fa..', 'Du Nord Vodka', ],
    type: 'category',
    title: {text: 'Product'},
    labels: {
        rotation: 0,
    }
},
yAxis: {
    min: 0,
    title: {
        text:  'Fuel CTC No Flight #'
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
                text: "Consumption/Pax"
              }
            },
            {            
              min: 0,
              opposite: true
            }
          ],
          plotOptions: {
            column: {
              dataLabels: {
                enabled: true
              },
              pointWidth:18,
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
    } }
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
 



 




