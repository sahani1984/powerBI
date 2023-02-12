import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CommunicationService } from './services/communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'powerbi';
  isloginpage:boolean=false;
  sidebarcollapse:boolean=false;
  isMobileSize:boolean=false;
  constructor(
    private router:Router, 
    private comunication:CommunicationService){
    if(window.innerWidth < 768) this.isMobileSize = true;
    else this.isMobileSize  = false;
    
    this.comunication.sidebarCollapse.subscribe((res:any)=> this.sidebarcollapse = res);
    this.router.events.pipe(filter((e)=> e instanceof NavigationEnd))
    .subscribe((res:any)=>{
      if(res["url"]=="/login") this.isloginpage = true;
      else this.isloginpage = false;
    
    })
  }

  
}
