import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Subscription } from 'rxjs';

const fullUrl = `${environment.apiUrl}${environment.apiPath}`;
const baseUrl = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  headers = new HttpHeaders();
  // subsVar: any;

  EmitirFotoEvento = new EventEmitter();
  subsVar: Subscription;

  constructor(private http: HttpClient) {
   this. headers.append('Content-Type', 'application/json');
   this. headers.append('Authorization', 'Bearer' + localStorage.getItem('userToken'));


  }

  Actualiza(formData: FormData) {
/*     const formData: FormData = new FormData();
   // console.log(fileToUpload.File);
    formData.append('Image', fileToUpload, fileToUpload.name);
  //  formData.append('IdPessoa', localStorage.getItem('idPessoa'));
    formData.append('Id_Trabalhador', IdTrabalhador); */
    return this.http.post(fullUrl + '/GravarFoto/', formData);
}
}
