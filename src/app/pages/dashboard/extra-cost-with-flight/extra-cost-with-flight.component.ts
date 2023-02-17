import { Component, OnInit } from '@angular/core';
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
  title_data: string = "Extra Cost With Flight";
  showLoader: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  consumptionPaxByProductOptions!: Highcharts.Options;
  fuelCTCWithFlightOptions!: Highcharts.Options;
  consumptionPaxByFlightOptions!: Highcharts.Options;
  consumptionPaxByProductData: any = [];
  fuelCTCWithFlight: any = [];
  consumptionPaxByFlightData: any = [];

  constructor(public communication: CommunicationService) {
    this.communication.apiDataLoading.subscribe((res: any) => this.showLoader = res);
    this.communication.dataAirlineFlightBeverage.subscribe((res: any) => {
      if (res && res.length) {
        this.consumptionPaxByProductData = this.createConsumptionPaxByProductData(res);
        this.fuelCTCWithFlight = this.fuelCTCWithFlightProduct(res);
        this.consumptionPaxByFlightData = this.createConsumptionPaxByFlightData(res);
        this.createconsumptionPaxByProductChart(this.consumptionPaxByProductData);
        this.createOBSCostToCarryChart(this.fuelCTCWithFlight['data'], this.fuelCTCWithFlight['category']);
        this.createConsumptionPaxByFlightChart(this.consumptionPaxByFlightData);
      } else {
        this.createconsumptionPaxByProductChart([]);
        this.createOBSCostToCarryChart([], []);
        this.createConsumptionPaxByFlightChart([]);
      }
    })
  }

  ngOnInit(): void {
  }

  createconsumptionPaxByProductChart(data: any[]) {
    this.consumptionPaxByProductOptions = {
      chart: {
        type: 'bar',
        scrollablePlotArea: {
          minHeight: 360
        },
        marginBottom: 40,
        height: 280,
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
          pointWidth: 16,
          pointPadding: 0,
          groupPadding: -.2
        }
      },
      credits: { enabled: false },
      series: data
    }
  }
  createOBSCostToCarryChart(data: any[], category: any[]) {
    this.fuelCTCWithFlightOptions = {
      chart: {
        type: 'bar',
        inverted: true,
        scrollablePlotArea: {
          minHeight: 360
        },
        height: 280,
        marginBottom: 45,
        marginRight: 30
      },
      title: {
        text: '',
        align: 'left'
      },
      xAxis: {
        categories: category,
        type: 'category',
        title: { text: 'Product' },
        labels: {
          rotation: 0,
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Fuel CTC with Flight #'
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
            enabled: false
          },
          pointWidth: 16,
          groupPadding: .1
        },
      },
      credits: { enabled: false },
      series: data
    }
  }
  createConsumptionPaxByFlightChart(data: any[]) {
    this.consumptionPaxByFlightOptions = {
      chart: {
        type: "column",
        height: 193,

      },
      title: {
        text: "Consumption/Pax by Flight #",
        align: "left"
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
          pointWidth: 24,
          groupPadding: .1
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
    }
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
  fuelCTCWithFlightProduct(data: any) {
    let dataList = JSON.parse(JSON.stringify(data));
    let productItem = [...new Set(dataList.map((d: any) => d.items).flat(1).map((m: any) => m.name))];
    let fuelcost: any = [];
    productItem.forEach((item: any) => {
      let x = dataList.map((a: any) => a.items).flat(1).filter((b: any) => b.name == item)
        .map((c: any) => (c.weight.value * c.quantity.inbound) * 0.07).reduce((r: any, y: any) => r + y, 0);
      fuelcost.push(Number(x.toFixed(1)));
    })
    let chartdata = [{ name: 'Total OBS Cost to Carry', color: "#118dff", data: fuelcost }]
    return { data: chartdata, category: productItem };
  }
  createConsumptionPaxByFlightData(data: any) {
    let dataList = JSON.parse(JSON.stringify(data));
    let totalflight = [...new Set(dataList.map((f: any) => f.number))];
    let consumptionQty: any = [];
    totalflight.forEach((flight: any) => {
      let commondata = dataList.filter((d: any) => d.number == flight)
      let outQty = commondata.map((d: any) => d.items).flat(1).map((x: any) => x.quantity).map((d: any) => d.outbound).reduce((a: any, b: any) => a + b, 0);
      let inbQty = commondata.map((d: any) => d.items).flat(1).map((x: any) => x.quantity).map((d: any) => d.inbound).reduce((a: any, b: any) => a + b, 0);
      let consuption = outQty - inbQty
      let passengers = commondata.map((d: any) => d.passengers.total).reduce((a: any, b: any) => a + b, 0);
      let result = Number((consuption / passengers).toFixed(2))
      consumptionQty.push(result);
    })
    return [totalflight, consumptionQty];
  }

}









