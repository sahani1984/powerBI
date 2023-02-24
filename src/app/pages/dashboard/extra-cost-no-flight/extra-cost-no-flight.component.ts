import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
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
  constructor(public communication: CommunicationService) {
    this.communication.deltaNoFlightLoading.subscribe((res: any) => this.showLoader = res);
    this.communication.dataAirlineBeverage.subscribe((res: any) => {
      if (res && res.length) {
        this.fuelCTCnoFlightdata = this.createFuelCTCnoFlightdata(res);
        this.createFuelCTCnoFlightChart(this.fuelCTCnoFlightdata);
      } else {
        this.createFuelCTCnoFlightChart([]);
      }
    })
  }
  ngOnInit(): void {
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
