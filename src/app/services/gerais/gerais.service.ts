import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BalancoAnual, Pagamentos, ResumoGeral } from '@app/models';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const fullUrl = `${environment.apiUrl}${environment.apiPath}`;
const baseUrl = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class GeraisService {

  constructor(private http: HttpClient) { }
  ontrabalhadorChanged: BehaviorSubject<any>;
  onSelectedtrabalhadorChanged: BehaviorSubject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  BuscaPagamentos(): Observable<Pagamentos[]> {
    return this.http.get<Pagamentos[]>(fullUrl + '/ListaTrab/' + localStorage.getItem('role')).pipe(
      // share(),
      // console.log(Object(response).data)
      tap(heroes => console.log('Trabalhador carregados com sucesso')),

      catchError(this.handleError('Trabalhador', []))
    );
  }


  ResumoGeral(): Observable<ResumoGeral[]> {
    return this.http.get<ResumoGeral[]>(fullUrl + '/Resumogeral').pipe(
      // share(),
      // console.log(Object(response).data)
      tap(heroes => console.log('Pagamento carregados com sucesso')),

      catchError(this.handleError('Pagamentos', []))
    );
  }

  BalancoAnual(id): Observable<BalancoAnual[]> {
    return this.http.get<BalancoAnual[]>(fullUrl + '/balancoanual?ano=' + id).pipe(
      // share(),
      // console.log(Object(response).data)
      tap(heroes => console.log('BalancoAnual carregados com sucesso')),
      catchError(this.handleError('Pagamentos', []))
    );
  }

  // tslint:disable-next-line: typedef
  searhhdata(model: any) {
    // tslint:disable-next-line: no-debugger
    debugger;
    return this.http.post<any>('http://localhost:1141/Api/Searchdata/search', model);
  }


  // tslint:disable-next-line: typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
