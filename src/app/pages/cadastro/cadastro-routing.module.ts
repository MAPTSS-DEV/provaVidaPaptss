import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from '../home/home.component';
import { AddEditComponent } from './add-edit/add-edit.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: HomeComponent },

            // Book crud
            { path: 'func-list', component: HomeComponent },
            { path: 'func-add', component: AddEditComponent },
            { path: 'func-edit/:id', component: AddEditComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CadastroRoutingModule { }