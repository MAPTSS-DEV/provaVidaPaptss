import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertComponent } from './components/alert/alert.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor, getDutchPaginatorIntl, JwtInterceptor } from '@app/helpers';
import { HomeComponent } from '@app/pages/home';
import { WebcamModule } from 'ngx-webcam';

import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card'
import {DateAdapter, MatRippleModule, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CadastroComponent } from '@app/components';
import { CameraComponent } from './components/camera/camera.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    CadastroComponent,
    CameraComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    WebcamModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    MatRippleModule,
    MatMomentDateModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  exports: [MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule ], // and the exports
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // Provider importados da versão antiga
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
    { provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl()},
    { provide: MatDialogRef, useValue: {} }
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
