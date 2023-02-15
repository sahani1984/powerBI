import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import { CommunicationService } from 'src/app/services/communication.service';
highcharts3D(Highcharts);

@Component({
  selector: 'app-no-flight',
  templateUrl: './no-flight.component.html',
  styleUrls: ['./no-flight.component.scss']
})
export class NoFlightComponent implements OnInit {
  title_data:string="No Flight";
  showLoader:boolean=false;
  Highcharts: typeof Highcharts = Highcharts;
  rateChartOptions!: Highcharts.Options;
  rateChartData: any[] = [];
  costChartOptions!: Highcharts.Options;
  costChartData: any[] = [];
  returnedChartOptions!: Highcharts.Options;
  returnedChartData: any[] = [];
  inboundChartOptions!: Highcharts.Options;
  inboundChartData:  any[] = [];
  productOption_filter:any=[];

  constructor(private fb:FormBuilder,
    public communication:CommunicationService) { 
    this. communication.apiDataLoading.subscribe((res:any)=> this.showLoader = res);
    this. rateChartData = this.createRateChartData();
    this. costChartData = this.createCostChartData();
    this. returnedChartData = this.createreturnedChartData();
    this. inboundChartData = this.createInboundChartData();
    this. communication.filterOptions.subscribe((res:any)=> this.productOption_filter = res["product"])
  }

  ngOnInit(): void {
    this. createrateChart(this.rateChartData);
    this. createcostChart(this.costChartData);
    this. createreturnedChart(this.returnedChartData);
    this. createinboundChart(this.inboundChartData);
  }

  createrateChart(data:any[]){
   this.rateChartOptions = {
    chart: {
      type: "bar",
      inverted: true,
      scrollablePlotArea: {
        minHeight: 250 
    },
    height:250,
      marginBottom: 40  
      },

    title: {
      text: 'Count by Product',
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
        text: 'Count'
    }
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true
      },
      pointWidth:20
     },      
  },
  credits:{enabled:false},
  series:data
   }
  }
  createcostChart(data:any[]){
    this.costChartOptions = {
      chart: {
        type: "bar",
        inverted: true,
        scrollablePlotArea: {
          minHeight: 250 
      },
      height:250,   
      marginBottom: 40 

    },

     title: {
       text: 'Cost By Product',
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
        text: 'Cost'
    }
  },
  
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: true,
        format: '${point.y:,.1f}',
      },
      pointWidth:20
     },      
  },
  credits:{enabled:false},
   series:data
    }
  }
  createreturnedChart(data:any[]){
    this.returnedChartOptions = {

      chart: {
        type: "bar",
        inverted: true,
        scrollablePlotArea: {
            minHeight: 250 
        },
        height:250,
        marginBottom: 40  
     },

     title: {
       text: '% Returned by Product',
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
        text: '%returned'
    }
  },
   plotOptions: {
    bar: {
      dataLabels: {
        enabled: true,
        format: '{point.y:,.1f}%',
      },
      pointWidth:20,
     },      
  },
  credits:{enabled:false},
   series:data
    }
  }
  createinboundChart(data:any[]){
    this.inboundChartOptions ={
      chart: {
        scrollablePlotArea: {
          minHeight: 250        
      },
      height:250,
      marginRight: 30
    },
    title: {
      text: 'Inbound,Outbound and % returned by Month and Day',
      align:'left'
  },
  xAxis: {
      categories: ['']
  },
  yAxis: [
    {
      title: {
        text: "Inbound and Outbound"
      }
    },
    {
      title:{
        text: "% returned", 
        textAlign:'right'
      }
    }
    ],

  plotOptions: {
    column: {
      dataLabels: {
        enabled: false
      },
      pointWidth:8,
      groupPadding:.1
     },      
  },
  legend: {
    layout: 'horizontal',
    align: 'left',
    verticalAlign: 'top',
    width: "120%",
    x: -10
  },
  credits:{enabled:false},
        series:data
    }
  }



   createCountByProductData(data: any[]) {
    let dataList = JSON.parse(JSON.stringify(data));
    let productItems = [...new Set(dataList.map((k: any) => k.label))];
    let countByProduct: any = [];
    productItems.forEach((item: any) => {
      let itemCount = dataList.filter((d: any) => d.label.toLowerCase() === item.toLowerCase()).map((l: any) => l.count);
      countByProduct.push([item, itemCount.reduce((m: any, n: any) => m + n, 0)]);
    })
    return [{ color: "#12239e", data: countByProduct }]
  }

  createCostByProductData(data: any[]) {
    let dataList = JSON.parse(JSON.stringify(data));
    let productItems = [...new Set(dataList.map((k: any) => k.label))];
    let costByProduct: any = [];
    productItems.forEach((item: any) => {
      let itemCount = dataList.filter((d: any) => d.label.toLowerCase() === item.toLowerCase())
      let itemCost = itemCount.map((r: any) => (r.cost.value * r.count)).reduce((m: any, n: any) => m + n, 0);  
      costByProduct.push([item, Number(itemCost.toFixed(1))]);
    })
    return [{ color: "#12239e", data: costByProduct }]
  }





   createRateChartData(){
    return [{
      type: 'bar',
        name: 'Unemployed',
        color: "#118dff",
        data: [
          ['Diet Coke',56901],
          ['Du Nord Vod..',51253],
          ['Coke',50363],
          ['Ginger Ale',45526],
          ['Tip Top Marg..',41694],
          ['Sprite',31765],
          ['Woodford Whi..',29540],
          ['Tip Top Old Fas..',26636]],
        showInLegend: false
    }]
  }
  createCostChartData(){
    return [{
      type: 'bar',
        name: 'Unemployed',
        color: "#12239e",
        data: [
        ['Tip Top Marg..',79219],
        ['Tip Top Old Fas..',50608],
        ['Du Nord Vod..',29214],
        ['Red Wine',21351],
        ['Diet Coke',17070],
        ['Woodford Whi..',16838],
        ['Coke',15109],
        ['Ginger Ale',13658]],
        showInLegend: false
    }]
  }
  createreturnedChartData(){
    return [{
      type: 'bar',
        name: 'Unemployed',
        color: "#e66c37",
        data: [
           ['Bacardi Rum',93],
           ['Tip Top Marg..',82],
           ['Coke Zero',81], 
           ['Bombay Sapp..',81],
           ['Jake Daniels',79],
           ['Red Wine',76],
           ['Sprite',74], 
           ['Woodford Whi..',72]],
        showInLegend: false
    }]
  }
  createInboundChartData(){
    return [{
      type: 'spline',
      name: '% returned',
      legendIndex: 0,
      data: [3, 2.67, 3, 6.33, 3.33,3, 3, 4, 7, 4.33,3, 4.67, 6, 6.33, 3.33,3, 3.67, 4, 6.88, 4.33,3, 2.67, 3, 6.33, 3.33, 4,3, 5, 3, 3, 4,3, 4, 4.2,4,3,4,3, 3, 5, 3, 4,5, 3.2, 3, 3, 4,3, 3.6, 3.3, 3, 4],
      color: "#e66c37",
      index: 5,
     
    },
     {
      legendIndex: 1,
      type: 'column',
      name: 'Inbound',
      color:"#118dff",
      data: [0.3,0.3,0.3,0.6,0.6,0.4,0.4,0.6,0.5,0.3,0.3,0.3,0.6,2,2,1.5,1,1,1,4,3, 2, 1, 3, 4, 4,3, 2, 1, 3, 4,3, 2, 1, 3, 4,3, 2, 1, 1, 1,0.8, 2, 1, 0.9, 1.2,1.5, 2,0.6, 0.5, 0.4,0.5]
    }, 
    {
      legendIndex: 2,
      type: 'column',
      name: 'Outbound',
      color: "#12239e",
      data: [0.3,0.3,0.3,1,1,0.4,0.4,0.8,0.5,0.3,0.3,0.3,0.8,2.5,2.5,2,1.5,1.5,4.1,2.4,1.2,1.2,3,5, 4, 3.5, 4,3, 2, 1, 3, 4,3, 2, 1, 3, 4,3, 2, 1.2, 1.2, 1.2,1, 3, 1.3, 1.1, 1.5,2, 3, 0.7, 1, 0.6]
    },
     ]
    
  }
}  

