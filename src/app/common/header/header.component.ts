
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PowerbiDbService } from 'src/app/services/powerbi-db.service';
import * as moment from 'moment';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  searchform!: FormGroup;
  showMessagesDropdown: boolean = false;
  showUserDropdown: boolean = false;
  sidebarcollapse: boolean = false;
  activeClient: any = "3f6a2bc4-d190-411f-a41c-21c6d0e54855";
  start_date: Date = this.comunication.setStartDate(new Date());
  end_date: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private comunication: CommunicationService,
    private powerbiDb: PowerbiDbService,
    private router: Router) {
    this.initform();
    this.comunication.sidebarCollapse.subscribe((res: any) => this.sidebarcollapse = res);
    this.searchform.valueChanges.subscribe((res: any) => this.activeClient = res["client"])
  }

  ngOnInit(): void {
    this.clientLists();
    this.getBeverage();
    this.getFlightBeverage();
    this.searchform.valueChanges.subscribe(
      (res: any) => {
        this.activeClient = res["client"];
        this.start_date = res["start_date"];
        this.end_date = res["end_date"];
        this.comunication.mainFilterData.next(res);
        this.getBeverage();
        this.getFlightBeverage();
      }
    )   
  }



  clientList: any[] = [];
  clientLists() {
    let obj: any = {};
    obj["data"] = {};
    obj["data"]["serviceEndpoint"] = "/client-listing";
    obj["data"]["serviceRequestType"] = "POST";
    this.powerbiDb.getClientLists(obj).subscribe({
      next: (res: any) => {
        if (res["statusCode"] == 200) {
          this.clientList = res["data"];
        }
      },
      error: (err) => console.log(err)
    })
  }

  sidebarToggle() {
    this.comunication.sidebarCollapse.next(!this.sidebarcollapse);
  }

  logout() {
    let obj: any = {};
    obj["data"] = {};
    obj["data"]["serviceEndpoint"] = "/sign-out";
    obj["data"]["serviceRequestType"] = "POST";
    this.powerbiDb.singOut(obj).subscribe({
      next: (res: any) => {
        if (res["statusCode"] == 200) {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => console.log(err)
    })
  }

  createFilterOptions(data: any) {
    let origin = [...new Set(data.map((d: any) => d.origin))];
    let destination = [...new Set(data.map((d: any) => d.destination))];
    let product = [...new Set(data.map((d: any) => d.items).flat(1).map((d: any) => d.name))];
    let flight = [...new Set(data.map((d: any) => d.number))];
    let obj: any = {};
    obj["origin"] = origin;
    obj["destination"] = destination;
    obj["product"] = product;
    obj["flight"] = flight;
    return obj;
  }

  makeData(data: any) {
    let datalist = JSON.parse(JSON.stringify(data));
    this.comunication.totalFlight = datalist.length;
    this.comunication.totalDrawers = datalist.map((d: any) => d.drawers).map((x: any) => x.inbound).reduce((a: any, b: any) => a + b);

    let boardQty: any = [];
    let inboundQty: any = [];
    datalist.forEach((d: any) => boardQty.push(...d.items.map((s: any) => s.quantity).map((m: any) => m.outbound)));
    datalist.forEach((d: any) => inboundQty.push(...d.items.map((s: any) => s.quantity).map((m: any) => m.inbound)));
    this.comunication.totalBoardedQuantity = boardQty.reduce((a: any, b: any) => a + b)
    this.comunication.totalInboundQuantity = inboundQty.reduce((a: any, b: any) => a + b);

    let boardedWeight: any = [];
    datalist.forEach((d: any) => {
      let outboundQty = d.items.map((s: any) => s.quantity).map((m: any) => m.outbound);
      let weight = d.items.map((s: any) => s.weight).map((m: any) => m.value);
      let result: any = [];
      outboundQty.forEach((item: any, index: number) => {
        result.push(Number(item * weight[index]).toFixed(2))
      })
      boardedWeight.push(...result);
    });
    this.comunication.totalBoardedWeight =
      boardedWeight.reduce((x: any, y: any) => Number(x) + Number(y)).toFixed(0)

    let inboundWeight: any = [];
    datalist.forEach((d: any) => {
      let inboundQty = d.items.map((s: any) => s.quantity).map((m: any) => m.inbound);
      let weight = d.items.map((s: any) => s.weight).map((m: any) => m.value);
      let result: any = [];
      inboundQty.forEach((item: any, index: number) => {
        result.push(Number(item * weight[index]).toFixed(2))
      })
      inboundWeight.push(...result);
    });
    this.comunication.totalInboundWeight = inboundWeight.reduce((x: any, y: any) => Number(x) + Number(y)).toFixed(0);
    let deltaItems = datalist.map((d: any) => d.items).flat(1);
    let wprk = deltaItems.map((m: any) => m.quantity.inbound * m.weight.value).reduce((a: any, b: any) => a + b, 0);
    this.comunication.WeightOfProductReturnToKitchen = Number(wprk.toFixed(0));
    let FuelCTC = deltaItems.map((m: any) => (m.quantity.inbound * m.weight.value) * 0.07).reduce((a: any, b: any) => a + b, 0);
    this.comunication.FuelCTCwithFlight = Number(FuelCTC.toFixed(0));
    let emissionWithLife = deltaItems.map((m: any) => (m.quantity.inbound * m.weight.value) * 0.19).reduce((a: any, b: any) => a + b, 0);
    this.comunication.Emissions_lbs_withFlight = Number(emissionWithLife.toFixed(0));
    let labourcost = datalist.map((d: any) => d.drawers.inbound * 0.62).reduce((a: any, b: any) => a + b, 0);
    this.comunication.LaborCost = Number(labourcost.toFixed(0))
  }


  makeInfoDeltaNoFlight(data: any) {
    let datalist = JSON.parse(JSON.stringify(data));
    let productReturnTokitchenNoFlight = datalist.map((k: any) => k.count * k.weight.value).reduce((m: any, n: any) => m + n, 0);
    this.comunication.weightOfProductReturnToKitchenNoFlight = Number(productReturnTokitchenNoFlight.toFixed(0));
    let FuelCTCNoFlight = datalist.map((q: any) => (q.count * q.weight.value) * 0.07).reduce((a: any, b: any) => a + b, 0);
    this.comunication.fuelCTCnoFlight = Number(FuelCTCNoFlight.toFixed(0));
    let EmissionNoFlight = datalist.map((p: any) => (p.count * p.weight.value) * 0.19).reduce((c: any, d: any) => c + d, 0);
    this.comunication.emission_lbs_noFlight = Number(EmissionNoFlight.toFixed(0));
    let uniqMedaIds = [...new Set(datalist.map((q: any) => q.mediaID))];
    this.comunication.labourCostWithoutFlight = (uniqMedaIds.length * 0.62);
    this.comunication.totalDrawersNoFlight = uniqMedaIds.length;
  }

  getBeverage() {
    this.comunication.deltaNoFlightLoading.next(true);
    let obj: any = {};
    obj["startDate"] = moment(this.start_date).format('YYYY-MM-DD');
    obj["endDate"] = moment(this.end_date).format('YYYY-MM-DD');
    obj["clientId"] = this.activeClient;
    this.powerbiDb.getBeverages(obj).subscribe({
      next: (res: any) => {
        this.comunication.dataAirlineBeverageOriginal.next(res);
        this.comunication.dataAirlineBeverage.next(res);
        this.makeInfoDeltaNoFlight(res);
        this.comunication.deltaNoFlightLoading.next(false);
      },
      error: (err) => {
        this.comunication.deltaNoFlightLoading.next(false);
        console.log(err)
      }
    })
  }



  getFlightBeverage() {
    this.comunication.apiDataLoading.next(true);
    let obj: any = {};
    obj["startDate"] = moment(this.start_date).format('YYYY-MM-DD');
    obj["endDate"] = moment(this.end_date).format('YYYY-MM-DD');
    obj["clientId"] = this.activeClient;
    this.powerbiDb.getFlightBeverages(obj).subscribe({
      next: (res: any) => {
        this.makeData(res["match"]);
        this.comunication.apiDataLoading.next(false);
        this.comunication.filterOptions.next(this.createFilterOptions(res["match"]))
        this.comunication.dataAirlineFlightBeverageOriginal.next(res["match"]);
        this.comunication.dataAirlineFlightBeverage.next(res["match"]);
      },
      error: (err) => {
        this.comunication.apiDataLoading.next(false);
        console.log(err)
      }
    })
  }

  initform() {
    let d = new Date();
    this.searchform = this.fb.group({
      client: [this.activeClient],
      start_date: [this.start_date],
      end_date: [this.end_date]
    })
    this.comunication.mainFilterData.next(this.searchform.value);
  }
}
