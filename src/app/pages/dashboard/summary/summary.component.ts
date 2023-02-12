import { Component, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
highcharts3D(Highcharts);
import * as moment from 'moment';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  title_data:string="Summary";
  showLoader:boolean=false;
  Highcharts: typeof Highcharts = Highcharts;
  barChartOptions!: Highcharts.Options;
  columnChartOptions!: Highcharts.Options;
  weightChartOptions!: Highcharts.Options;
  rateChartOptions!: Highcharts.Options;
  totalFlightCountByData:any=[];
  totalBoardedAndInboundQtyData: any=[];
  totalBoardedAndInboundWeightData:any=[];
  productOption_filter:any=[];

  constructor(public communication:CommunicationService){   
    this.communication.apiDataLoading.subscribe((res:any)=> this.showLoader = res);   
    this.communication.dataAirlineFlightBeverage.subscribe((res:any)=>{
      if(res){  
        console.log(res);
          if(res.length){
          this.totalFlightCountByData = this.createDataForAllFlightByDate(res);
          let BIQty = this.totalBoardedAndInboundQtyByDate(res);
          let BIWeigt = this.totalBoardedAndInboundWeightByDate(res);
          this.totalBoardedAndInboundQtyData = BIQty["data"];
          this.totalBoardedAndInboundWeightData = BIWeigt["data"];          
          this.createColumnChart(this.totalFlightCountByData); 
          this.createrateChart(this.totalBoardedAndInboundQtyData, BIQty["startdate"]);
          this.createWeightChart(this.totalBoardedAndInboundWeightData,  BIWeigt["startdate"])
        }else{
          this.createColumnChart([]); 
          this.createrateChart([]); 
          this.createWeightChart([]); 
        }
      }
    })
  }

  ngOnInit(): void {       
  }

  createColumnChart(data:any[]){
    this.columnChartOptions = {
      chart: {
        type: 'column',
        height:300,
    },
    title: {
        text: 'Total flights counted by Date'
    },
    xAxis: {
        type: 'category',
        labels: {
            rotation: -45,
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '# flights',
        },
    },
    plotOptions: {
      column: {color: '#118DFF',
        dataLabels: {
          enabled: true
        },
        pointWidth:35,
        pointPadding:.5,
        groupPadding: .05445,
       },      
    },
    legend: {
        enabled: true
    },
    credits:{enabled:false},
    series:data
     }
  }

  qtyxAsisLabel:any="";
  createrateChart(data:any, dateStart?:any){ 
  this.qtyxAsisLabel = moment(dateStart).format('MMM');   
  let xAxisData:any = [];   
   data[0]?.data.forEach((item:any, i:number)=>{
    xAxisData.push(moment(dateStart, 'YYYY-MM-DD').add('days', i).format('DD'));
    })
  this.rateChartOptions = {
      chart: {
        type: "column",
        inverted: false,    
        height:260,   
        marginBottom:40  
         
    },
    title: {
        text: "Total Boarded Quantity and Total Inbound Quantity by Date",
    },
    xAxis: {
        categories: xAxisData      
    },
    yAxis: {
        title: {
          text: "Total Boarded/Inbound Quantity",
        },
    },
    tooltip: {
        valueSuffix: " K",
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter: function () {            
            return Highcharts.numberFormat(this.y! / 1000, 1) + "K";
          }
        },
        pointWidth: 8,
        pointPadding:.5,
        groupPadding: .05445,
       },      
    },
    legend: {
      layout:"horizontal",
      width:"100%",
      verticalAlign:"top",
      x:0
    },
    credits:{enabled:false},
    series:data
    }
  }  

  createWeightChart(data:any[], dateStart?:any){
    let xAxisData:any = [];   
   data[0]?.data.forEach((item:any, i:number)=>{
    xAxisData.push(moment(dateStart, 'YYYY-MM-DD').add('days', i).format('DD'));
    })
    this.weightChartOptions = {
      chart: {
        type: "column",
        height:260,
        marginBottom:40    
    },
    title: {
        text: "Total Boarded Weight and Total Inbound Weight by Date",
        align:"left"
    },
    xAxis: {
        categories:xAxisData
    },
    yAxis: {
        title: {
            text: "Total Boarded/Inbound Weight",
        },
    },
    tooltip: {
        valueSuffix: " K",
    },
    legend: {
      layout:"horizontal",
      width:"100%",
      verticalAlign:"top",
      x:0
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          formatter: function () {            
            return Highcharts.numberFormat(this.y! / 1000, 1) + "K";
          }
        },
        pointWidth: 8,
        pointPadding:.5,
        groupPadding: .08,
       },      
    },
    credits:{enabled:false},
    series:data
    }
  }
 

  createDataForAllFlightByDate(data:any){
    let datalist = JSON.parse(JSON.stringify(data));
    let dateLists = datalist.map((d:any)=> d.departure);
    let allflight:any=[];
    let allFlightByDate:any=[];
     dateLists.forEach((item:any)=> allflight.push(moment(item).format('Do MMM')));
     let uniqDate = [...new Set(allflight)];
     uniqDate.forEach((item:any)=>{
      allFlightByDate.push([item, allflight.filter((d:any)=> d == item).length])
     })      
     return  [{
      name:'Days',
      data:allFlightByDate,   dataLabels: {
      enabled: true,
      color: '#66728E',
      crop: false,
      overflow: 'none',
      align: 'center',
      style: { fontSize: '14px'}
     }}];
  }
  totalBoardedAndInboundQtyByDate(data:any){    
    let totalBoardedFlight:any=[];
    let totalInboundFlight:any[]=[];
    let datalist = JSON.parse(JSON.stringify(data));
    datalist.forEach((item:any)=> item.departure = item.departure.split('T')[0]);
    let startDate =  datalist[0].departure   
    let totalday = [...new Set(datalist.map((d:any)=> d.departure))];
    totalday.forEach((d:any)=>{
     let boardedInDay =  datalist.filter((s:any)=> s.departure ==d).map((x:any)=> x.items).flat(1).map((d:any)=> d.quantity).map((o:any)=> o.outbound).reduce((a:any, b:any)=> a+b);     
     let inboundInDay =  datalist.filter((s:any)=> s.departure ==d).map((x:any)=> x.items).flat(1).map((d:any)=> d.quantity).map((o:any)=> o.inbound).reduce((a:any, b:any)=> a+b);     
     totalBoardedFlight.push(boardedInDay);
     totalInboundFlight.push(inboundInDay);    
    })
    let obj:any={};
    obj["startdate"] = startDate;
    obj["data"] = [
      {name:'Total Boarded Quantity', data:totalBoardedFlight,  color:"#118dff"},
      {name:'Total Inbound Quantity', data:totalInboundFlight,  color:"#12239e"}
    ]   
    return obj;
  }
  totalBoardedAndInboundWeightByDate(data:any){  
    let totalBoardedWeight:any=[];
    let totalInboundWeight:any[]=[];
    let datalist = JSON.parse(JSON.stringify(data));
    datalist.forEach((item:any)=> {
      item.departure = item.departure.split('T')[0];
      item.items.forEach((d:any)=>{
        d.quantity['value'] = d.weight['value']
      })     
    });   
    let startDate =  datalist[0].departure   
    let totalday = [...new Set(datalist.map((d:any)=> d.departure))];
    totalday.forEach((d:any)=>{   
       let boardedWeightDay =  datalist.filter((s:any)=> s.departure ==d).map((x:any)=> x.items).flat(1).map((d:any)=> d.quantity).map((o:any)=> Number(o.outbound * o.value).toFixed(2)).map((n:any)=> Number(n)).reduce((a:any, b:any)=> a+b);
       let inboundWeightDay =  datalist.filter((s:any)=> s.departure ==d).map((x:any)=> x.items).flat(1).map((d:any)=> d.quantity).map((o:any)=> Number(o.inbound * o.value).toFixed(2)).map((n:any)=> Number(n)).reduce((a:any, b:any)=> a+b);
        
       totalBoardedWeight.push(Number(boardedWeightDay).toFixed(0));
       totalInboundWeight.push(Number(inboundWeightDay).toFixed(0));
    })
    totalBoardedWeight = totalBoardedWeight.map((d:any)=> Number(d));
    totalInboundWeight = totalInboundWeight.map((d:any)=> Number(d));
    let obj:any={};
    obj["startdate"] = startDate;
    obj["data"] = [
      {name:'Total Boarded Weight', data:totalBoardedWeight, color:"#118dff"},
      {name:'Total Inbound Weight', data:totalInboundWeight,  color:"#12239e"}
    ]    
     return obj;
  }
















  // createColumnChartData(){
  //   return  [{
  //     name: 'Days',
  //     data: [
  //         ['2 Aug', 9],
  //         ['3 Aug', 5],
  //         ['4 Aug', 4],
  //         ['5 Aug', 5],
  //         ['6 Aug', 1],
  //         ['7 Aug', 3],
  //         ['8 Aug', 8],
  //         ['9 Aug', 4],
  //         ['10 Aug', 5],
  //         ['11 Aug', 9],
  //         ['12 Aug', 3],
  //         ['13 Aug', 2],
  //         ['14 Aug', 11],
  //         ['15 Aug', 6],
  //         ['16 Aug', 5],
  //         ['17 Aug', 5],
  //         ['18 Aug', 1],
  //         ['19 Aug', 4],
  //         ['20 Aug', 2],
  //         ['21 Aug', 2],
  //         ['22 Aug', 1],
  //     ],
  //     dataLabels: {
  //         enabled: true,
  //         color: '#66728E',
  //         crop: false,
  //         overflow: 'none',
  //         align: 'center',
  //         style: {
  //             fontSize: '14px'
  //         }
  //     }
  // }]
  // }
  // createRateChartData(){
  //   return [{
      
  //       name: "Total Boarded Quantity",
  //       data: [70, 69, 95, 145, 188, 255, 
  //           222, 260, 233, 183, 139, 96],
  //           color:"#118dff"
  //   },
  //   {
  //       name: "Total Inbound Quantity",
  //       data: [60, 57, 85, 130, 195, 215, 
  //           172, 210, 143, 233, 179, 200],
  //           color:"#12239e"
  //   }]
  // }
  // createWeightChartData(){
  //   return [{
      
  //     name: "Total Boarded Weight",
  //       data: [70, 69, 95, 145, 188, 255, 
  //           222, 260, 233, 183, 139, 96],
  //           color:"#118dff"
  //   },
  //   {
  //     name: "Total Inbound Weight",
  //       data: [60, 57, 85, 130, 195, 215, 
  //           172, 210, 143, 233, 179, 200],
  //           color:"#12239e"
  //   }]
  // }




}

