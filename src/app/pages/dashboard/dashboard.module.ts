import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from 'src/app/common/header/header.component';
import { SiderbarComponent } from 'src/app/common/siderbar/siderbar.component';
import { ByDayComponent } from './by-day/by-day.component';
import { DetailsComponent } from './details/details.component';
import { SummaryComponent } from './summary/summary.component';
import { ExtraCostNoFlightComponent } from './extra-cost-no-flight/extra-cost-no-flight.component';
import { ExtraCostWithFlightComponent } from './extra-cost-with-flight/extra-cost-with-flight.component';
import { NoFlightComponent } from './no-flight/no-flight.component';
import { AddUserComponent } from '../admin/add-user/add-user.component';
import { UserListsComponent } from '../admin/user-lists/user-lists.component';
import { MaterialsModule } from 'src/app/shared/materials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TitleBarComponent } from 'src/app/common/title-bar/title-bar.component';
import { ClickElsewhereDirective } from 'src/app/shared/click-elsewhere.directive';
import { SearchFilterPipe } from 'src/app/shared/pipes/search-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterComponent } from 'src/app/common/filter/filter.component';
import { MajorInfoComponent } from '../../common/major-info/major-info.component';


@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    SiderbarComponent,
    ByDayComponent,   
    DetailsComponent,
    ExtraCostNoFlightComponent,
    ExtraCostWithFlightComponent,
    NoFlightComponent,
    SummaryComponent,
    AddUserComponent,
    UserListsComponent,
    TitleBarComponent,
    ClickElsewhereDirective,
    SearchFilterPipe,
    FilterComponent,
    MajorInfoComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HighchartsChartModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsModule,
    NgxPaginationModule
  ]
})
export class DashboardModule {}
