import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '@environments/environment';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

const fullUrl = `${environment.apiUrl}${environment.apiPath}`;
const baseUrl = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  EmitirEvento = new EventEmitter();
  subsVar: Subscription;

  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  GravaTrabalhador(Trab: FormGroup) {
    //  console.log(user);
    //  const reqHeader = new HttpHeaders({'No-Auth': 'True'});
    //  const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this.http.post(fullUrl + '/InserirTrabalhador/', Trab).pipe(
      timeout(30000)
    );
  }

  AtualizarTrabalhador(Trab: FormGroup) {
    //  console.log(user);
    //  const reqHeader = new HttpHeaders({'No-Auth': 'True'});
    //  const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this.http.post(fullUrl + '/ActualizarCadastro/', Trab).pipe(
      timeout(30000)
    );
  }

  ApagaFoto(id): Observable<any[]> {
    return this.http.get<any[]>(fullUrl + '/ApagarFoto/' + id).pipe(
      tap(heroes => console.log('detalhe do Trabalhador Eliminado com sucesso')),

      catchError(this.handleError('Erro ao eliminar Trabalhador', []))
    );
  }

}
