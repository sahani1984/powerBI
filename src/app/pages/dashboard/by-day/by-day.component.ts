import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import * as moment from 'moment';
import { filter } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
highcharts3D(Highcharts);
declare var $: any;

@Component({
  selector: 'app-by-day',
  templateUrl: './by-day.component.html',
  styleUrls: ['./by-day.component.scss']
})
export class ByDayComponent implements OnInit {
  title_data: string = "By Day";
  showLoader: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  totalBoundInboundOptions!: Highcharts.Options;
  totalBoundInboundWeighOptions!: Highcharts.Options;
  fuelAndLabourCostOptions!: Highcharts.Options;
  totalBoundInboundData: any = [];
  totalBoundInboundWeight: any = [];
  fuelAndLabourCostData: any = [];

  constructor(private communication: CommunicationService, private router: Router) {
    this.communication.apiDataLoading.subscribe((res: any) => this.showLoader = res);
    this.communication.dataAirlineFlightBeverage.subscribe((res: any) => {
      if (res && res.length) {
        this.totalBoundInboundData = this.createTotalBoardedInboundCostData(res);
        this.totalBoundInboundWeight = this.totalBoardedAndInboundWeigthDate(res);
        this.fuelAndLabourCostData = this.createFuelAndLabourCostData(res);
        this.createtotalBoundInboundQytChart(this.totalBoundInboundData['data'], this.totalBoundInboundData['category']);
        this.createTotalBoundInboundWeighChart(this.totalBoundInboundWeight['data'], this.totalBoundInboundWeight['category']);
        this.createFuelAndLabourCostChart(this.fuelAndLabourCostData['data'], this.fuelAndLabourCostData['category']);
      } else {
        this.createtotalBoundInboundQytChart([], []);
        this.createTotalBoundInboundWeighChart([], []);
        this.createFuelAndLabourCostChart([], []);
      }
    });

  }

  ngOnInit(): void {
        


  }

  createtotalBoundInboundQytChart(data: any[], category: any) {
    this.totalBoundInboundOptions = {
      chart: {
        type: 'column',
        inverted: true,
        scrollablePlotArea: {
          minHeight: 1400
        },
        height: 465,
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
          format: '${text}',
        }

      },
      tooltip: {
        valueSuffix: ' Thousands'
      },

      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            formatter: function () {
              return Highcharts.numberFormat(this.y! / 1000, 1) + "K";
            },
          },
          pointWidth: 16,
          pointPadding: 0,
          groupPadding: .11,
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
  createTotalBoundInboundWeighChart(data: any[], category: any) {
    this.totalBoundInboundWeighOptions = {
      chart: {
        type: 'column',
        inverted: true,
        scrollablePlotArea: {
          minHeight: 1400,
        },
        height: 465,
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
            formatter: function () {
              return Highcharts.numberFormat(this.y! / 1, 0);
            },
          },
          pointWidth: 16,
          pointPadding: 0,
          groupPadding: .11,
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
  createFuelAndLabourCostChart(data: any[], category: any) {
    this.fuelAndLabourCostOptions = {
      chart: {
        type: 'bar',
        inverted: true,
        scrollablePlotArea: {
          minHeight: 1400
        },
        height: 465,
        marginRight: 30
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: category
      },
      yAxis: {
        min: 0,
        title: {
        },
        labels: {
          format: '${}',
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
    let dateInshort = dates.map((d: any) => moment(d).format('MMM DD'));
    let chartData = [
      { name: 'Total Boarded Cost', data: boardedActualData, color: "#118dff" },
      { name: 'Total Inbound Cost', data: inboundActualData, color: "#12239e" },
      { name: 'Consumed Cost', data: cosumedCost, color: "#e66c37" }
    ]
    return { category: dateInshort, data: chartData }
  }


  totalBoardedAndInboundWeigthDate(data: any) {
    let dataList: any = JSON.parse(JSON.stringify(data));
    let dates = [...new Set(dataList.map((d: any) => d.departure.split('T')[0]))];
    let boardedWeightdata: any = [];
    let inboundWeightdata: any = [];
    dates.forEach((item: any) => {
      let a = dataList.filter((x: any) => x.departure.split('T')[0] == item).map((d: any) => d.items).flat(1)
        .map((s: any) => (s.quantity.outbound * s.weight.value).toFixed(1)).map((d: any) => Number(d)).reduce((r: any, y: any) => r + y, 0);
      let b = dataList.filter((x: any) => x.departure.split('T')[0] == item).map((d: any) => d.items).flat(1)
        .map((s: any) => (s.quantity.inbound * s.weight.value).toFixed(1)).map((d: any) => Number(d)).reduce((r: any, y: any) => r + y, 0);
      boardedWeightdata.push({ data: a, departure: item })
      inboundWeightdata.push({ data: b, departure: item })
    })
    let boardedActualWeightData = boardedWeightdata.map((d: any) => Number(d.data.toFixed(1)));
    let inboundActualWeightData = inboundWeightdata.map((d: any) => Number(d.data.toFixed(1)));
    let cosumedWeigth: any = [];
    boardedActualWeightData.forEach((d: any, i: number) => {
      let x = Number((d - inboundActualWeightData[i]).toFixed(1))
      cosumedWeigth.push(x);
    });
    let dateInshort = dates.map((d: any) => moment(d).format('MMM DD'));
    let chartData = [
      { name: 'Total Boarded Weight', data: boardedActualWeightData, color: "#118dff" },
      { name: 'Total Inbound Weigth', data: inboundActualWeightData, color: "#12239e" },
      { name: 'Consumed Weight', data: cosumedWeigth, color: "#e66c37" }
    ]
    return { category: dateInshort, data: chartData }
  }



  createFuelAndLabourCostData(data: any) {
    let dataList: any = JSON.parse(JSON.stringify(data));
    let dates = [...new Set(dataList.map((d: any) => d.departure.split('T')[0]))];
    let fuelcost: any = [];
    let labourcost: any = [];
    dates.forEach((item: any) => {
      let f = dataList.filter((x: any) => x.departure.split('T')[0] == item).map((d: any) => d.items).flat(1)
        .map((s: any) => (s.weight.value * s.quantity.inbound) * 0.07).reduce((r: any, y: any) => r + y, 0);
      let l = dataList.filter((x: any) => x.departure.split('T')[0] == item).map((d: any) => d.drawers).map((d: any) => d.inbound * 0.62).reduce((r: any, y: any) => r + y, 0);
      fuelcost.push(Number(f.toFixed(1)));
      labourcost.push(Number(l.toFixed(1)));
    })
    let dateInshort = dates.map((d: any) => moment(d).format('MMM DD'));
    let chartData = [
      { name: 'Labor Cost', data: labourcost, color: "#12239e" },
      { name: 'Fuel CTC With Flight', data: fuelcost, color: "#118dff" }
    ]
    return { category: dateInshort, data: chartData }
  }

}
