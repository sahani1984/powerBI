import { Component, OnInit } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private comunication:CommunicationService) {
    
   }

  ngOnInit(): void {
  }
  sidebarclose(){
    this.comunication.sidebarCollapse.next(false);
  }


}
