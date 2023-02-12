import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

const matElement = [ 
  MatCardModule,
  MatButtonModule,
  MatInputModule, 
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatTableModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatIconModule,
  MatNativeDateModule,
  MatButtonToggleModule

]

@NgModule({
  declarations: [],
  imports: [CommonModule,matElement],
  exports:[matElement]
})
export class MaterialsModule { }
