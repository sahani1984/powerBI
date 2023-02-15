import { TemplateLiteral } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import * as moment from 'moment';
import { CommunicationService } from 'src/app/services/communication.service';
highcharts3D(Highcharts);

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  title_data: string = "Details";
  showLoader:boolean=false;
  Highcharts: typeof Highcharts = Highcharts;
  tradeChartOptions!: Highcharts.Options;
  tradeChartData: any[] = [];
  rateChartOptions!: Highcharts.Options;
  rateChartData: any;
  weigthChartOptions!: Highcharts.Options;
  weightChartData: any;
  rainChartOptions!: Highcharts.Options;
  rainChartData: any[] = [];
  details!:FormGroup;
  totalBoardedAndInboundQtyData:any[]=[];
  totalBoundInboundWeight:any=[];
  flightCountData:any=[];

  constructor(
  private fb:FormBuilder,
  public communication:CommunicationService) {
    this.tradeChartData = this.createTradeChartData();
    this.rainChartData = this.createRainChartData();
    this.communication.apiDataLoading.subscribe((res:any)=> this.showLoader = res);
     this.communication.dataAirlineFlightBeverage
    .subscribe((res:any)=>{
      if(res && res.length){
        this.filterData(res);
          let BIQty = this.totalBoardedAndInboundQtyByProduct(res);
          this.totalBoardedAndInboundQtyData = BIQty;
           this.createrateChart(this.totalBoardedAndInboundQtyData);
           this.totalBoundInboundWeight = this.totalBoardedAndInboundWeigthDate(res);
          this.createweightChart(this.totalBoundInboundWeight);
          this.flightCountData = this.flightCount(res);  
          this.createRainChart(this.flightCountData);
      }
    })
  }

  ngOnInit(): void {
    this.createTradeChart(this.tradeChartData);
   //this.createrateChart(this.totalBoardedAndInboundQtyData);
   this.createweightChart(this.totalBoundInboundWeight);
  } 
  filterData(data:any){
    let datalist = JSON.parse(JSON.stringify(data));
    this.communication.totalFlight = datalist.length;
    this.communication.totalDrawers = datalist.map((d:any)=> d.drawers)
    .map((x:any)=> x.inbound).reduce((a:any,b:any)=> a+b);    
  }

  createrateChart(data: any[]) {
    this.rateChartOptions = {
      chart: {
        type: "bar",
        inverted: true,
        scrollablePlotArea: {
          minHeight:420 
      },
      height:330,
        marginBottom: 60,
        marginRight:30
        },
      title: {
        text: "",
      },
      tooltip: {
        valueSuffix: "K",
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
      yAxis: [
        {
          title: {
            text: "Total Boarded and Inbound Quantity",
          textAlign:'right'
          }
        },
      ],
      legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        width: "120%",
        x: -10
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            formatter: function () {            
              return Highcharts.numberFormat (this.y!/1000, 1)+"K";
            },
          },
          pointWidth: 10,
          pointPadding: 0.1,
          groupPadding: 0.04,
        },
      },
      credits: { enabled: false },
      series: data
    }
  }
  createweightChart(data: any[]) {
    this.weigthChartOptions = {
      chart: {
        type: "bar",
        inverted: true,
        scrollablePlotArea: {
          minHeight:420 
      },
      height:330,
        marginBottom: 60,
        marginRight:30
        },
      title: {
        text: "",
        align: 'center',
        verticalAlign: 'bottom'

      },

      tooltip: {
        valueSuffix: "K",
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
          text: 'Total Boarded Weight and Total Inbound'
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        width: "120%",
        x: -10
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          },
          pointWidth: 10,
          pointPadding: 0,
          groupPadding: 0.09,
        },
      },
      credits: { enabled: false },
      series: data
    }
  }
  createTradeChart(data: any[]) {
    this.tradeChartOptions = {
      chart: {
        type: 'bar',
        marginBottom: 40,
        height: 330,
      },

      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Cars sold: {point.y}'
      },
      title: {
        text: '',
        align: 'left'
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
          text: 'Consumption/Pax'
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        width: "120%",
        x: -10
      },

      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          },
          pointWidth: 20,
          pointPadding: 0,
          groupPadding: -.2
        }
      },
      credits: { enabled: false },
      series: data
    }
  }
  createRainChart(data: any[]) {
    this.rainChartOptions = {
      chart: {
        height: 250,
        marginRight: 30
      },
      title: {
        text: "Consumtion/Pax and Flight # Count by Flight #",
        align: "left"
      },
      credits: {
        enabled: false
      },
      xAxis: [
        {
          categories: data[0],
          title: {
            text: "Flight#"
          }
        }],
      yAxis: [
        {
          title: {
            text: "Consumption/Pax"
          }
        },
        {
          title: {
            text: "Flight # Count"
          },
          min: 0,
          opposite: true
        }],

      series: [
        {
          name: "Consumption/Pax",
          color: "#118dff",
          type: "column",
          data: data[1],
          tooltip: {
          },
          pointWidth: 30,
        },
        {
          name: "Flight # Count",
          color: "#12239e",
          type: "spline",
          data: data[2],
          yAxis: 1
        }
      ],
      tooltip: {
        shared: true
      },
      legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        width: "120%",
        x: -10
      },
      noData: {
        style: {
          fontSize: "16px"
        }
      }
    }
  }
  totalBoardedAndInboundQtyByProduct(data:any){
    let datalist = JSON.parse(JSON.stringify(data));
    let dd = datalist.map((item:any)=> item.items).flat(1);
    let productItem = [...new Set(dd.map((d:any)=> d.name))];
    let boardedData:any=[];
    let inboundData:any=[];
    productItem.forEach((item:any)=>{
       let outQty = dd.filter((d:any)=> d.name == item).map((x:any)=> x.quantity).map((d:any)=> d.outbound).reduce((a:any,b:any)=> a+b, 0);
       let inbQty = dd.filter((d:any)=> d.name == item).map((x:any)=> x.quantity).map((d:any)=> d.inbound).reduce((a:any,b:any)=> a+b, 0);
       boardedData.push([item, outQty]);
       inboundData.push([item, inbQty]);
    })
     let bound = {
      name: "Total Boarded Quantity",
      data:boardedData,
      color: "#118dff"
    }
    let inboud = {
      name: "Total Inbounded Quantity",
      data:inboundData,
      color: "#12239e"
    }
    return [bound, inboud];
  }
  totalBoardedAndInboundWeigthDate(data:any){
    let dataList = JSON.parse(JSON.stringify(data));
    let productItem = [...new Set(dataList.map((d:any)=> d.items).flat(1).map((m:any)=> m.name))];
    let boardedData:any=[];
    let inboundData:any=[];
    productItem.forEach((item:any)=>{
      let x =  dataList.map((a:any)=> a.items).flat(1).filter((b:any)=> b.name == item)
      .map((c:any)=> (c.quantity.outbound * c.weight.value)).reduce((r: any, y: any) => r + y, 0);
      let y =  dataList.map((a:any)=> a.items).flat(1).filter((b:any)=> b.name == item)
      .map((c:any)=> (c.quantity.inbound * c.weight.value)).reduce((r: any, y: any) => r + y, 0);
       boardedData.push([item,Number(x.toFixed(0))]);
       inboundData.push([item,Number(y.toFixed(0))]);
    })
     let bound = {
      name: "Total Boarded Weight",
      data:boardedData,
      color: "#118dff"
    }
    let inboud = {
      name: "Total Inbounded Weight",
      data:inboundData,
      color: "#12239e"
    }
    return [bound, inboud];
  }
  flightCount(data:any){
    let dataList: any = JSON.parse(JSON.stringify(data));
    let boardedData:any=[]
    let dates = [...new Set(dataList.map((a:any)=>a.number))];  
    boardedData.push(dates);
    let flight ={
      name:"Flight  Count",
      data:boardedData,
      color:"#118dff"
    };  
    return [flight]
  }
  

  createRateChartData() {
    return [{
      name: "Total Boarded Quantity",
      data: [
        ['Do Nord Vod..', 6.8],
        ['Tip Top Marg..', 4.1],
        ['Woodford W..', 3.5],
        ['Coke', 2.9],
        ['Diet Coke', 2.9],
        ['Ginger Ale', 2.9],
        ['Tip Top Old F..', 2.9],
        ['Bombay Sap..', 2.3]],
      color: "#118dff"
    },
    {
      name: "Total Inbounded Quantity",
      data: [['Do Nord Vod..', 6.0],
      ['Tip Top Marg..', 3.6],
      ['Woodford W..', 3.0],
      ['Coke', 2.2],
      ['Diet Coke', 2.3],
      ['Ginger Ale', 1.9],
      ['Tip Top Old F..', 2.9],
      ['Bombay Sap..', 2.1]],
      color: "#12239e"
    }]
  }
  createWeightChartData() {
    return [{
      name: "Total Boarded Weight",
      data: [
        ['Coke', 2394],
        ['Diet Coke', 2394],
        ['Ginger Ale', 2394],
        ['Sprite', 1402],
        ['Red Win', 1285],
        ['Tip Top Marge..', 1051],
        ['Woodford Whi..', 1051],
        ['Coke Zero', 934]],
      color: "#118dff"
    },
    {
      name: "Total Inbounded Weight",
      data: [
        ['Coke', 1793],
        ['Diet Coke', 1935],
        ['Ginger Ale', 1541],
        ['Sprite', 1015],
        ['Red Win', 994],
        ['Tip Top Marge..', 950],
        ['Woodford Whi..', 900],
        ['Coke Zero', 850]],
      color: "#12239e"
    }]
  }
  createTradeChartData() {
    return [{
      name: "Consumption/Pax by Product",
      data: [
        ['Ginger Ale', 0.06],
        ['Coke', 0.04,],
        ['Du Nord Vodka', 0.033],
        ['Diet Coke', 0.032],
        ['Woodford Whisk..', 0.031],
        ['Tip Top Margarita', 0.03],
        ['Red Win', 0.03],
        ['Bacardi Rum', 0.03],
        ['Jack Daniels Whi..', 0.025]],
      color: "#118dff",
    }]
  }
  createRainChartData() {
    return [
      [1005, 650, 367, 475, 520, 672, 321, 369, 502, 548, 305, 375, 410, 426, 465, 1406, 309, 408, 434, 437, 441, 2452, 899],
      [0.35, 0.34, 0.88, 0.12, 0.31, 0.35, 0.13, 0.00, 0.73, 0.62, 0.43, 0.29, 0.37, 0.10, 0.00, 0.68, 0.87, 0.28, 0.43, 0.55, 0.29, 0.16, 0.87],
      [11, 9, 7, 6, 6, 6, 5, 5, 5, 5, 4, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1]
    ]
  }
}


