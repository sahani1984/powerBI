import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import { filter } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
highcharts3D(Highcharts);

@Component({
  selector: 'app-extra-cost-no-flight',
  templateUrl: './extra-cost-no-flight.component.html',
  styleUrls: ['./extra-cost-no-flight.component.scss']
})
export class ExtraCostNoFlightComponent implements OnInit {
  title_data: string = "Extra Cost No Flight";
  showLoader: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  fuelCTCnoFlightOptions!: Highcharts.Options;
  fuelCTCnoFlightdata: any[] = [];
  datalist: any = [];
  constructor(public communication: CommunicationService, private router: Router) {
    this.communication.deltaNoFlightLoading.subscribe((res: any) => this.showLoader = res);
    this.communication.dataAirlineBeverage.subscribe((res: any) => {
      if (res) {
        this.datalist = res;
        if (router.url == '/dashboard/extra-cost-no-flight') this.initializeCharts(this.datalist);
      }
    })
  }
  ngOnInit(): void {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((res: any) => {
        if (res["url"] == '/dashboard/extra-cost-no-flight') {
          this.initializeCharts(this.datalist);
        }
      })
    this.initializeCharts(this.datalist);
  }

  initializeCharts(data: any) {
    console.log(data);
    if (data.length) {
      this.fuelCTCnoFlightdata = this.createFuelCTCnoFlightdata(data);
      this.createFuelCTCnoFlightChart(this.fuelCTCnoFlightdata);
    } else {
      this.createFuelCTCnoFlightChart([]);
    }
  }

  createFuelCTCnoFlightChart(data: any[]) {
    this.fuelCTCnoFlightOptions = {
      chart: {
        type: 'bar',
        inverted: true,
        height: 465,
      },
      title: {
        text: 'Total OBS cost to carry',
        align: "left"
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
          text: 'Fuel CTC No Flight #'
        },
        margin: 0
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: 'Total OBS Cost: <b>{point.y:.1f} $</b>'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            format: '${point.y:,.1f}',
            align: "left"
          },
          pointWidth: 18,
        },
      },
      credits: { enabled: false },
      series: data
    }
  }
  createFuelCTCnoFlightdata(data: any) {
    let dataLists = JSON.parse(JSON.stringify(data));
    let productItems = [...new Set(dataLists.map((m: any) => m.label))];
    let fuelCTCdata: any = [];
    productItems.forEach((item: any) => {
      let data = dataLists.filter((m: any) => m.label.toLowerCase() == item.toLowerCase())
        .map((n: any) => (n.count * n.weight.value) * 0.07).reduce((m: any, n: any) => m + n, 0);
      data = Number(data.toFixed(1))
      fuelCTCdata.push([item, data]);
    })
    return [{ color: "#118dff", data: fuelCTCdata }]
  }


}
