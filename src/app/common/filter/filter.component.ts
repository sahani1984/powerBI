import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommunicationService } from 'src/app/services/communication.service';
import * as moment from 'moment';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'data-filter-form',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  isCardCollapse: boolean = false;
  filterform!: FormGroup;
  min_date: Date = new Date(new Date().setDate(1));
  max_date: Date = new Date();
  productList: any[] = [];
  originList: any[] = [];
  destinationList: any[] = [];
  flightList: any[] = [];
  airlineFltBevDataListOriginal: any[] = [];
  alirlineBevDataListOriginal: any[] = [];



  @Input('filterCase') filter_case: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private communication: CommunicationService) {
    this.initform();
    this.communication.dataAirlineFlightBeverageOriginal.subscribe((res: any) => this.airlineFltBevDataListOriginal = res);
    this.communication.dataAirlineBeverageOriginal.subscribe((res: any) => this.alirlineBevDataListOriginal = res);

    this.communication.filterOptions.subscribe((res: any) => {
      this.productList = res["product"];
      this.originList = res["origin"];
      this.destinationList = res["destination"];
      this.flightList = res["flight"];
    })


    this.communication.mainFilterData.subscribe((res: any) => {
      this.min_date = res["start_date"];
      this.max_date = res["end_date"];
      this.filterform.patchValue({ start_date: this.min_date, end_date: this.max_date });
    })

    this.filterform.valueChanges.subscribe((res: any) => {
      this.deltaItemsFilter(res);
      this.deltaNoFlightFilter(res);
    })
  }

  ngOnInit(): void {
    // this.router.events.pipe(filter((e: any) => e instanceof NavigationEnd))
    //   .subscribe((res: any) => {          
    //     if (res) {         
    //       this.deltaItemsFilter(this.filterform.value);
    //       this.deltaNoFlightFilter(this.filterform.value);
    //     }
    //   })
    this.showFilterControls(this.filter_case);
  }


 

  deltaItemsFilter(res: any) {
    let data = JSON.parse(JSON.stringify(this.airlineFltBevDataListOriginal));
    let result: any[] = []
    result = data.filter((item: any) => new Date(item.departure).getTime() >= res["start_date"].getTime());
    result = result.filter((item: any) => new Date(item.departure).getTime() <= res["end_date"].getTime());
    if (res['week'] !== "") {
      result = result.filter((item: any) => moment(item.departure).format('dddd').toLowerCase() === res["week"].toLowerCase())
    }
    if (res['product'] !== "") {
      result.forEach((item: any) => item.items = item.items.filter((d: any) => d.name.toLowerCase() == res['product'].toLowerCase()));
    }
    if (res['flight'] !== "") {
      result = result.filter((item: any) => item.number === res["flight"]);
    }
    if (res['origin'] !== "") {
      result = result.filter((item: any) => item.origin.toLowerCase() === res["origin"].toLowerCase());
    }
    if (res['destinaton'] !== "") {
      result = result.filter((item: any) => item.destination.toLowerCase() === res["destinaton"].toLowerCase());
    }
    if (res['time'] !== "") {
      result = result.filter((item: any) => this.getDayOfTime(item.departure).toLowerCase() === res["time"].toLowerCase());
    }
    this.communication.dataAirlineFlightBeverage.next(result);
  }



  deltaNoFlightFilter(res: any) {
    let data = JSON.parse(JSON.stringify(this.alirlineBevDataListOriginal));
    let result: any[] = []
    result = data.filter((item: any) => new Date(item.takenAt).getTime() >= res["start_date"].getTime());
    result = result.filter((item: any) => new Date(item.takenAt).getTime() <= res["end_date"].getTime());
    if (res['week'] !== "") {
      result = result.filter((item: any) => moment(item.takenAt).format('dddd').toLowerCase() === res["week"].toLowerCase())
    }
    if (res['product'] !== "") {
      result = result.filter((d: any) => d.label.toLowerCase() == res['product'].toLowerCase());
    }
    if (res['time'] !== "") {
      result = result.filter((item: any) => this.getDayOfTime(item.takenAt).toLowerCase() === res["time"].toLowerCase());
    }
    this.communication.dataAirlineBeverage.next(result);
  }


  getDayOfTime(day: any) {
    let d = new Date(day);
    let hrs = d.getHours();
    let mins = d.getMinutes();
    let timeType: any = "morning";
    if (hrs >= 5 && ((hrs == 5 && mins >= 30) || (hrs > 5 && hrs < 12))) timeType = 'morning'
    else if (hrs >= 12 && hrs < 18) timeType = 'afternoon'
    else if ((hrs >= 18 && hrs < 24) || hrs > 0) timeType = 'evening'
    else timeType = 'midnight';
    return timeType
  }



  /*SHOW FILTER CONTROLS CONDTIONALY AS FILTER IS A GENERIC*/
  showProductfilter: boolean = false;
  showOriginfilter: boolean = false;
  showDestinationfilter: boolean = false;
  showFlightfilter: boolean = false;
  showDayOfWeekfilter: boolean = false;
  showFilterControls(caseType: any) {
    if (caseType !== 'byday') this.showProductfilter = true;
    if (caseType !== 'noflight') this.showDayOfWeekfilter = true;
    if (caseType === 'byday') this.showDestinationfilter = true;
    if ((caseType == 'byday') || (caseType == 'details')) {
      this.showOriginfilter = true;
      this.showFlightfilter = true;
    }
    this.filterform.patchValue({ product: "", origin: "", destinaton: "", flight: "" })
  }


  initform() {
    let d = new Date();
    this.filterform = this.fb.group({
      product: [""],
      origin: [""],
      destinaton: [""],
      flight: [""],
      week: [""],
      start_date: [new Date(d.setDate(1))],
      end_date: [new Date()],
      time: [""]
    })
  }

}
