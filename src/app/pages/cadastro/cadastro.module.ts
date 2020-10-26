import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout/layout.component';
import { CadastroRoutingModule } from './cadastro-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AddEditComponent } from './add-edit/add-edit.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CadastroRoutingModule,
        FormsModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    declarations: [
        LayoutComponent,
        AddEditComponent,
    ]
})
export class CadastroModule { }