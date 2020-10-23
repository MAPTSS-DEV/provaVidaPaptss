import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add/add-edit.component';
import { LayoutComponent } from './layout/layout.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent
    ]
})
export class UsersModule { }