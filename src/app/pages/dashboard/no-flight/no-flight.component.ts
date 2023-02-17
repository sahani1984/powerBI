import { Component, OnInit } from '@angular/core';
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
  title_data: string = "No Flight";
  showLoader: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  countByProductOptions!: Highcharts.Options;
  costByProductOptions!: Highcharts.Options;
  returnedByProductOptions!: Highcharts.Options;
  IOROptions!: Highcharts.Options;
  countByProductData: any = [];
  costByProductData: any = [];
  returnByProductData: any = [];
  IORByMonthDayData: any = {};


  constructor(public communication: CommunicationService) {
    this.communication.deltaNoFlightLoading.subscribe((res: any) => this.showLoader = res);
    this.communication.dataAirlineBeverage.subscribe((res: any) => {
      if (res && res.length) {
        this.countByProductData = this.createCountByProductData(res);
        this.costByProductData = this.createCostByProductData(res);
        this.returnByProductData = this.createReturnByProductData(res);
        this.IORByMonthDayData = this.createInboundOutboundAndReturnByMonthDayData(res);
        this.createCountByProductChart(this.countByProductData);
        this.createCostByProductChart(this.costByProductData);
        this.createReturnedByProductChart(this.returnByProductData);
        this.createIORChart(this.IORByMonthDayData['data'], this.IORByMonthDayData['category']);
      } else {
        this.createCountByProductChart([]);
        this.createCostByProductChart([]);
        this.createReturnedByProductChart([]);
        this.createIORChart([], []);
      }
    })
  }

  ngOnInit(): void { }

  createCountByProductChart(data: any[]) {
    this.countByProductOptions = {
      chart: {
        type: "bar",
        inverted: true,
        scrollablePlotArea: {
          minHeight: 420
        },
        marginBottom: 40,
        height: 330,
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Count by Product: {point.y} K'
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
          pointWidth: 18
        },
      },
      credits: { enabled: false },
      series: data
    }
  }
  createCostByProductChart(data: any[]) {
    this.costByProductOptions = {
      chart: {
        type: "bar",
        inverted: true,
        scrollablePlotArea: {
          minHeight: 420
        },
        marginBottom: 40,
        height: 330,
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Cost By Product: {point.y} $'
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
            format: '${point.y:,f}',
          },
          pointWidth: 18
        },
      },
      credits: { enabled: false },
      series: data
    }
  }
  createReturnedByProductChart(data: any[]) {
    this.returnedByProductOptions = {

      chart: {
        type: "bar",
        inverted: true,
        scrollablePlotArea: {
          minHeight: 420
        },
        marginBottom: 40,
        height: 330,
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Returned by Product: {point.y} %'
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
            format: '{point.y:,f}%',
          },
          pointWidth: 20,
        },
      },
      credits: { enabled: false },
      series: data
    }
  }
  createIORChart(data: any[], category: any[]) {
    this.IOROptions = {
      chart: {
        width: 800,
        height: 280,
        scrollablePlotArea: {
          minWidth: 1200,
        }
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Inbound,Outbound and % returned: {point.y}'
      },
      title: {
        text: 'Inbound,Outbound and % returned by Month and Day',
        align: 'left'
      },
      xAxis: {
        categories: category,
      },
      yAxis: [
        {
          title: {
            text: "Inbound and Outbound"
          },
          scrollbar: {
            enabled: true,
            showFull: true
          }
        },
        {
          title: {
            text: "% returned",
            textAlign: 'right'
          }
        }
      ],

      plotOptions: {
        column: {
          dataLabels: {
            enabled: false
          },
          pointWidth: 6,
          pointPadding: 0,
          groupPadding: .055,
        },
      },
      legend: {
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        width: "120%",
        x: -10
      },
      credits: { enabled: false },
      series: data
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
    return [{ color: "#118dff", data: countByProduct, showInLegend: false }]
  }


  createCostByProductData(data: any[]) {
    let dataList = JSON.parse(JSON.stringify(data));
    let productItems = [...new Set(dataList.map((k: any) => k.label))];
    let costByProduct: any = [];
    productItems.forEach((item: any) => {
      let itemCount = dataList.filter((d: any) => d.label.toLowerCase() === item.toLowerCase())
      let itemCost = itemCount.map((r: any) => (r.cost.value * r.count)).reduce((m: any, n: any) => m + n, 0);
      costByProduct.push([item, Number(itemCost.toFixed(0))]);
    })
    return [{ color: "#12239e", data: costByProduct, showInLegend: false }]
  }
  createReturnByProductData(data: any[]) {
    let dataList = JSON.parse(JSON.stringify(data));
    let productItems = [...new Set(dataList.map((k: any) => k.label))];
    let returnedByProduct: any = [];
    productItems.forEach((item: any) => {
      let noflightCount = dataList.filter((k: any) => k.label == item).map((d: any) => d.count ? d.count : 0).reduce((m: any, n: any) => m + n, 0)
      let noflightOutbound = dataList.filter((k: any) => k.label == item).map((d: any) => d.outbound ? d.outbound : 0).reduce((m: any, n: any) => m + n, 0)
      if (noflightOutbound !== 0) {
        let totalReturn = Number((noflightCount / noflightOutbound).toFixed(2)) * 100;
        returnedByProduct.push([item, totalReturn]);
      }
    })
    return [{ color: "#e66c37", data: returnedByProduct, showInLegend: false }];
  }
  createInboundOutboundAndReturnByMonthDayData(data: any[]) {
    let dataList = JSON.parse(JSON.stringify(data));
    let dates = [...new Set(dataList.map((k: any) => k.takenAt.split('T')[0]))];
    let outboundData: any = [];
    let inboundData: any = [];
    let returnData: any = [];
    dates.forEach((date: any) => {
      let outbound: any = dataList.filter((d: any) => d.takenAt.split('T')[0] === date).map((d: any) => d.outbound ? d.outbound : 0).reduce((a: any, b: any) => a + b, 0)
      let inbound: any = dataList.filter((d: any) => d.takenAt.split('T')[0] === date).map((d: any) => d.count ? d.count : 0).reduce((a: any, b: any) => a + b, 0)
      let returned: any = Number((inbound / outbound).toFixed(2)) * 100
      outboundData.push(outbound);
      inboundData.push(inbound);
      returnData.push(returned);
    })
    let category = dates.map((d: any) => new Date(d).getUTCDate())
    let chartdata = [
      { type: 'spline', name: '% returned', color: "#e66c37", data: returnData },
      { type: 'column', name: 'Inbound', color: "#118dff", data: inboundData },
      { type: 'column', name: 'Outbound', color: "#12239e", data: outboundData }
    ]
    return { data: chartdata, category: category };

  }
}

