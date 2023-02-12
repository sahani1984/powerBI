import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import * as moment from 'moment';
import { CommunicationService } from 'src/app/services/communication.service';
import { PowerbiDbService } from 'src/app/services/powerbi-db.service';
highcharts3D(Highcharts);
declare var $: any;

@Component({
  selector: 'app-by-day',
  templateUrl: './by-day.component.html',
  styleUrls: ['./by-day.component.scss']
})
export class ByDayComponent implements OnInit {
  title_data: string = "By Day";
  Highcharts: typeof Highcharts = Highcharts;
  barChartOptions!: Highcharts.Options;
  stackedChartOptions!: Highcharts.Options;
  weightChartOptions!: Highcharts.Options;
  totalBoundInboundData: any = [];
  weightChartData: any[] = [];
  fuelAndLabourCostData:any=[];



  constructor(private powerbidb: PowerbiDbService,
    private communication: CommunicationService) {
    // this.totalBoundInboundData = this.createBarChartData();
    this.weightChartData = this.createWeightChartData();
    // this.stackedChartData = this.createStackedChartData();



    this.communication.dataAirlineBeverage.subscribe((res: any) => console.log(res));
    this.communication.dataAirlineFlightBeverage.subscribe((res: any) => {
      if (res && res.length) {
        this.totalBoundInboundData = this.createTotalBoardedInboundCostData(res);
        this.fuelAndLabourCostData = this.createFuelAndLabourCostData(res);       
        this.createBarChart(this.totalBoundInboundData['data'], this.totalBoundInboundData['category']);
        this.createStackedChart(this.fuelAndLabourCostData['data'], this.fuelAndLabourCostData['category']);
      }
    });

  }

  ngOnInit(): void {
    this.createWeightChart(this.weightChartData);  
  }


  createBarChart(data: any[], category: any) {
    this.barChartOptions = {
      chart: {
        type: 'column',
        inverted: true,
        scrollablePlotArea: {
            minHeight: 1400        
        },
        height:465,
        marginRight: 30,
      
    },
      title: {
        text: ''
      },
      xAxis: {
        categories: category,
        title: {
          text: "Dates"
        }
      },
      yAxis: {
        min: 0,
        title: {
          align: 'high'
        },
        labels: {
          format: '',
        }

      },
      tooltip: {
        valueSuffix: ' Thousands'
      },

      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            format: '${point.y:,.0f}K',
            align: "left"
          },
          pointWidth: 16,
          pointPadding: 0,
          groupPadding: .1,
        },
      },
      legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        width: "120%",
        x: -10
      },
      credits: {
        enabled: false
      },
      series: data
    }
  }
  createWeightChart(data: any[]) {
    this.weightChartOptions = {
      chart: {
        type: 'column',
        inverted: true,
        height: 465,
        marginRight: 15
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: ['Aug 16', 'Aug 2', 'Aug 9', 'Aug 23',],
        title: {
          text: "Dates"
        }
      },
      yAxis: {
        min: 0,
        title: {
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' Thousands'
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            y: 0
          },
          pointWidth: 20,
          pointPadding: 0,
          groupPadding: .15,
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        width: "120%",
        x: -10
      },
      credits: {
        enabled: false
      },
      series: data
    }
  }
  createStackedChart(data: any[], category:any) {
    this.stackedChartOptions = {
      chart: {
        type: 'bar',
        inverted: true,
        scrollablePlotArea: {
          minHeight: 450
        },
        height: 470,
        marginRight: 30
      },
      title: {
        text: ''
      },
      xAxis: {
        categories:category
      },
      yAxis: {
        min: 0,
        title: {
        }
      },
      legend: {
        layout: "horizontal",
        width: "100%",
        verticalAlign: "top",
        x: 0
      },
      plotOptions: {
        bar: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            format: '${point.y:,.0f}',
          },
          pointWidth: 50,
        },
      },
      credits: {
        enabled: false
      },

      series: data
    }
  }

  createTotalBoardedInboundCostData(data: any) {
    let dataList: any = JSON.parse(JSON.stringify(data));
    let dates = [...new Set(dataList.map((d: any) => d.departure.split('T')[0]))];
    let boardeddata: any = [];
    let inbounddata: any = [];
    dates.forEach((item: any) => {
      let a = dataList.filter((x: any) => x.departure.split('T')[0] == item).map((d: any) => d.items).flat(1)
        .map((s: any) => (s.quantity.outbound * s.cost.value).toFixed(1)).map((d: any) => Number(d)).reduce((r: any, y: any) => r + y, 0);
      let b = dataList.filter((x: any) => x.departure.split('T')[0] == item).map((d: any) => d.items).flat(1)
        .map((s: any) => (s.quantity.inbound * s.cost.value).toFixed(1)).map((d: any) => Number(d)).reduce((r: any, y: any) => r + y, 0);
      boardeddata.push({ data: a, departure: item })
      inbounddata.push({ data: b, departure: item })
    })
    let boardedActualData = boardeddata.map((d: any) => Number(d.data.toFixed(1)));
    let inboundActualData = inbounddata.map((d: any) => Number(d.data.toFixed(1)));
    let cosumedCost: any = [];
    boardedActualData.forEach((d: any, i: number) => {
      let x = Number((d - inboundActualData[i]).toFixed(1))
      cosumedCost.push(x);
    });

    let  dateInshort = dates.map((d:any)=> moment(d).format('MMM DD'));

    let chartData = [
      { name: 'Total Boarded Cost', data: boardedActualData, color: "#118dff" },
      { name: 'Total Inbound Cost', data: inboundActualData, color: "#12239e" },
      { name: 'Consumed Cost', data: cosumedCost, color: "#e66c37" }
    ]
    return { category: dateInshort, data: chartData }
  }

  createFuelAndLabourCostData(data:any){
    let dataList: any = JSON.parse(JSON.stringify(data));
    let dates = [...new Set(dataList.map((d: any) => d.departure.split('T')[0]))];  
    let fuelcost: any = [];
    let labourcost:any=[];
    dates.forEach((item: any) => {
      let f = dataList.filter((x: any) => x.departure.split('T')[0] == item).map((d: any) => d.items).flat(1)
        .map((s: any) => (s.quantity.inbound * s.weight.value) * 0.07).reduce((r: any, y: any) => r + y, 0);
      let l = dataList.filter((x: any) => x.departure.split('T')[0] == item).map((d:any)=> d.drawers).map((d:any)=> d.inbound *0.62).reduce((r: any, y: any) => r + y, 0);
       console.log(l);   
      fuelcost.push(Number(f.toFixed(1)));
      labourcost.push(Number(l.toFixed(1)));
    })
    let  dateInshort = dates.map((d:any)=> moment(d).format('MMM DD')); 
    let chartData = [
      { name: 'Labor Cost', data: labourcost, color: "#12239e" },    
      { name: 'Fuel CTC With Flight', data: fuelcost, color: "#118dff" }
    ]
    console.log(chartData);
    return { category: dateInshort, data: chartData }
  }

  createBarChartData() {
    return [{
      name: 'Total Boarded Cost',
      data: [3.2, 2.6, 1.2, 0.8],
      color: "#118dff"
    }, {
      name: 'Total Inbound Cost',
      data: [2.6, 2.6, 1.0, 0.7],
      color: "#12239e"
    }, {
      name: 'Consumed Cost',
      data: [0.6, 0.1, 0.2, 0.1],
      color: "#e66c37"
    }]
  }
  createWeightChartData() {
    return [{
      name: 'Total Boarded Weight',
      data: [1462, 677, 1786, 460],
      color: "#118dff"
    }, {
      name: 'Total Inbound Weight',
      data: [1346, 484, 1344, 324,],
      color: "#12239e"
    }, {
      name: 'Consumed Cost',
      data: [166, 193, 442, 136,],
      color: "#e66c37"
    }]
  }

  createStackedChartData() {
    return [{
      name: 'Fuel CTC With Flight',
      data: [77, 30, 79, 20],
      color: "#12239e",


    }, {
      name: 'Labor Cost',
      data: [94, 34, 94, 23],
      color: "#118dff"
    },]
  }

  /*TITLE DATA*/
  getTitleData() {
    return {
      title: "Extra Cost with Flight",
      breadcrum: { name: "Dashboard", link: "/dashboard" }
    }
  }



}
