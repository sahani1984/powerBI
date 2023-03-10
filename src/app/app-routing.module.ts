import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {path:"", redirectTo:"/login", pathMatch:"full" },
  {path:"login", component:LoginComponent }, 
  {path: 'dashboard', canActivate:[AuthGuard], 
  loadChildren: () =>import('./pages/dashboard/dashboard.module')
  .then(m => m.DashboardModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
