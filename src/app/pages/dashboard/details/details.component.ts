import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import { CommunicationService } from 'src/app/services/communication.service';
highcharts3D(Highcharts);
import { filter } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  title_data: string = "Details";
  showLoader: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  consumptionPaxByProductOptions!: Highcharts.Options;
  inboundAndOutboundQytOptions!: Highcharts.Options;
  CPFcountByFlightOptions!: Highcharts.Options;
  inboundAndOutboundWeightOptions!: Highcharts.Options;
  totalBoardedAndInboundQtyData: any[] = [];
  totalBoundInboundWeight: any = [];
  consumptionPaxByProductData: any = [];
  CPFcountByFlightData: any = [];
  datalist: any = [];
  constructor(public communication: CommunicationService, private router: Router) {
    this.communication.apiDataLoading.subscribe((res: any) => this.showLoader = res);
    this.communication.dataAirlineFlightBeverage
      .subscribe((res: any) => {
        if (res) {      
          this.datalist = res;
          if (router.url == '/dashboard/details') this.initializeCharts(this.datalist);
        }
      })
  }

  ngOnInit(): void {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((res: any) => {
        if (res["url"] == '/dashboard/details') {
          this.initializeCharts(this.datalist);
        }
      })
    this.initializeCharts(this.datalist);
  }

  initializeCharts(data: any) {   
    if (data.length) {
      let BIQty = this.totalBoardedAndInboundQtyByProduct(data);
      this.totalBoardedAndInboundQtyData = BIQty;
      this.totalBoundInboundWeight = this.totalBoardedAndInboundWeigthDate(data);
      this.consumptionPaxByProductData = this.createConsumptionPaxByProductData(data);
      this.CPFcountByFlightData = this.createConsumptionPaxAndFlightCountByFlightData(data);
      this.createInboundAndOutboundQytChart(this.totalBoardedAndInboundQtyData);
      this.createInboundAndOutboundWeightChart(this.totalBoundInboundWeight);
      this.createConsumptionPaxByProductChart(this.consumptionPaxByProductData);
      this.createCPFcountByFlightChart(this.CPFcountByFlightData);
    } else {
      this.createInboundAndOutboundQytChart([]);
      this.createInboundAndOutboundWeightChart([]);
      this.createConsumptionPaxByProductChart([]);
      this.createCPFcountByFlightChart([]);
    }
  }

  createInboundAndOutboundQytChart(data: any[]) {
    this.inboundAndOutboundQytOptions = {
      chart: {
        type: "bar",
        inverted: true,
        scrollablePlotArea: {
          minHeight: 420
        },
        height: 330,
        marginBottom: 60,
        marginRight: 30
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
            textAlign: 'right'
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
              return Highcharts.numberFormat(this.y! / 1000, 1) + "K";
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
  createInboundAndOutboundWeightChart(data: any[]) {
    this.inboundAndOutboundWeightOptions = {
      chart: {
        type: "bar",
        inverted: true,
        scrollablePlotArea: {
          minHeight: 420
        },
        height: 330,
        marginBottom: 60,
        marginRight: 30
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
          pointPadding: 0.1,
          groupPadding: 0.04,
        },
      },
      credits: { enabled: false },
      series: data
    }
  }
  createConsumptionPaxByProductChart(data: any[]) {
    this.consumptionPaxByProductOptions = {
      chart: {
        type: 'bar',
        scrollablePlotArea: {
          minHeight: 420
        },
        marginBottom: 40,
        height: 330,
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Consumption/Pax: {point.y}'
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


  createCPFcountByFlightChart(data: any[]) {
    this.CPFcountByFlightOptions = {
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


  totalBoardedAndInboundQtyByProduct(data: any) {
    let datalist = JSON.parse(JSON.stringify(data));
    let dd = datalist.map((item: any) => item.items).flat(1);
    let productItem = [...new Set(dd.map((d: any) => d.name))];
    let boardedData: any = [];
    let inboundData: any = [];
    productItem.forEach((item: any) => {
      let outQty = dd.filter((d: any) => d.name == item).map((x: any) => x.quantity).map((d: any) => d.outbound).reduce((a: any, b: any) => a + b, 0);
      let inbQty = dd.filter((d: any) => d.name == item).map((x: any) => x.quantity).map((d: any) => d.inbound).reduce((a: any, b: any) => a + b, 0);
      boardedData.push([item, outQty]);
      inboundData.push([item, inbQty]);
    })
    let bound = {
      name: "Total Boarded Quantity",
      data: boardedData,
      color: "#118dff"
    }
    let inboud = {
      name: "Total Inbounded Quantity",
      data: inboundData,
      color: "#12239e"
    }
    return [bound, inboud];
  }


  totalBoardedAndInboundWeigthDate(data: any) {
    let dataList = JSON.parse(JSON.stringify(data));
    let productItem = [...new Set(dataList.map((d: any) => d.items).flat(1).map((m: any) => m.name))];
    let boardedData: any = [];
    let inboundData: any = [];
    productItem.forEach((item: any) => {
      let x = dataList.map((a: any) => a.items).flat(1).filter((b: any) => b.name == item)
        .map((c: any) => (c.quantity.outbound * c.weight.value)).reduce((r: any, y: any) => r + y, 0);
      let y = dataList.map((a: any) => a.items).flat(1).filter((b: any) => b.name == item)
        .map((c: any) => (c.quantity.inbound * c.weight.value)).reduce((r: any, y: any) => r + y, 0);
      boardedData.push([item, Number(x.toFixed(0))]);
      inboundData.push([item, Number(y.toFixed(0))]);
    })
    let bound = {
      name: "Total Boarded Weight",
      data: boardedData,
      color: "#118dff"
    }
    let inboud = {
      name: "Total Inbounded Weight",
      data: inboundData,
      color: "#12239e"
    }
    return [bound, inboud];
  }


  createConsumptionPaxByProductData(data: any) {
    let dataList = JSON.parse(JSON.stringify(data));
    let totalProduct = [...new Set(dataList.map((m: any) => m.items).flat(1).map((d: any) => d.name))];
    let consumptionQty: any = [];
    totalProduct.forEach((item: any) => {
      let commondata = dataList.map((d: any) => d.items).flat(1).filter((d: any) => d.name == item);
      let outQty = commondata.map((x: any) => x.quantity).map((d: any) => d.outbound).reduce((a: any, b: any) => a + b, 0);
      let inbQty = commondata.map((x: any) => x.quantity).map((d: any) => d.inbound).reduce((a: any, b: any) => a + b, 0);
      let consuption = outQty - inbQty
      let passengers = dataList.map((d: any) => d.passengers.total).reduce((a: any, b: any) => a + b, 0);
      let result = Number((consuption / passengers).toFixed(2))
      consumptionQty.push([item, result]);
    })
    return [{
      name: "Consumption/Pax by Product",
      color: "#118dff",
      data: consumptionQty
    }];
  }


  createConsumptionPaxAndFlightCountByFlightData(data: any) {
    let dataList = JSON.parse(JSON.stringify(data));
    let totalflight = [...new Set(dataList.map((f: any) => f.number))];
    let consumptionQty: any = [];
    let flightCount: any = [];
    totalflight.forEach((flight: any) => {
      let commondata: any = dataList.filter((d: any) => d.number == flight)
      let outQty = commondata.map((d: any) => d.items).flat(1).map((x: any) => x.quantity).map((d: any) => d.outbound).reduce((a: any, b: any) => a + b, 0);
      let inbQty = commondata.map((d: any) => d.items).flat(1).map((x: any) => x.quantity).map((d: any) => d.inbound).reduce((a: any, b: any) => a + b, 0);
      let consuption = outQty - inbQty
      let passengers = commondata.map((d: any) => d.passengers.total).reduce((a: any, b: any) => a + b, 0);
      let result = Number((consuption / passengers).toFixed(2))
      let flightlenght = dataList.filter((d: any) => d.number == flight).length;
      consumptionQty.push(result);
      flightCount.push(flightlenght);
    })
    return [totalflight, consumptionQty, flightCount];
  }
}


