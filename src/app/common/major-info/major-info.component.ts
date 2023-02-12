import { Component, OnInit, Input} from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-major-info',
  templateUrl: './major-info.component.html',
  styleUrls: ['./major-info.component.scss']
})
export class MajorInfoComponent implements OnInit {
  showLoader:boolean=false;
  cardCollapse:boolean=false;

  @Input('pageName') pagename:any;
  constructor(public communication:CommunicationService) { }

  ngOnInit(): void {
    this.showInfoWidgit(this.pagename);
  }

  showFlightDrawers:boolean=false;
  showTotalDrawersNoFlight:boolean=false;
  showTotalDrawerseWithFlight:boolean=false;
  showTotalBoardedInboundQty:boolean=false;
  showTotalBoardedInboundWeight:boolean=false;
  showInfoWidgit(caseType:any){
    if(caseType==='details' || caseType==='summary') this.showFlightDrawers = true; 
    if(caseType==='extraCostNoFlight') this.showTotalDrawersNoFlight = true;      
    if(caseType==='extraCostWidthFlight') this.showTotalDrawerseWithFlight = true;     
    if(caseType == 'summary' ){
      this.showTotalBoardedInboundQty=true; 
      this.showTotalBoardedInboundWeight = true;      
    }         
}

}
