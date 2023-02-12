import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from '../admin/add-user/add-user.component';
import { UserListsComponent } from '../admin/user-lists/user-lists.component';
import { ByDayComponent } from './by-day/by-day.component';
import { DashboardComponent } from './dashboard.component';
import { DetailsComponent } from './details/details.component';
import { ExtraCostNoFlightComponent } from './extra-cost-no-flight/extra-cost-no-flight.component';
import { ExtraCostWithFlightComponent } from './extra-cost-with-flight/extra-cost-with-flight.component';
import { NoFlightComponent } from './no-flight/no-flight.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, children:[
    {path:"", redirectTo:"by-day", pathMatch:"full"},
    {path:"by-day", component:ByDayComponent },
    {path:"details", component:DetailsComponent },
    {path:"no-flight", component:NoFlightComponent },
    {path:"extra-cost-with-flight", component:ExtraCostWithFlightComponent },
    {path:"extra-cost-no-flight", component:ExtraCostNoFlightComponent},
    {path:"summary", component:SummaryComponent },
    {path:"user-list", component:UserListsComponent },
    {path:"add-user", component:AddUserComponent },
  ] 
 },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
