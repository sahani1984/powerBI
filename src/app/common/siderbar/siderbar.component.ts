import { Component, OnInit } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrls: ['./siderbar.component.scss']
})
export class SiderbarComponent implements OnInit {
dropDownToggle:boolean=false;

  constructor(private comunication:CommunicationService) { }

  ngOnInit(): void {
  }

  sidebarclose(){
    this.comunication.sidebarCollapse.next(false);
  }

  sidebarCollapse(){
    this.comunication.sidebarCollapse.next(false);
  }

}
