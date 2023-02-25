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
      this.comunication.currentActiveRoute =  this.getActiveRoute(res["url"]);     
    })
  }


  getActiveRoute(params: any) {
    let allRoutes = ["by-day", "details", "no-flight", "extra-cost-with-flight", "extra-cost-no-flight", "summary"];
    let currRoute = params.split('/');
    let activeRoute: any = "";
    currRoute.forEach((item: any) => {
      if(allRoutes.includes(item)) {
        activeRoute = item;
        return;
      }
    });    
    return activeRoute;
  }
  
}
