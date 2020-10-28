import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActividadePrimaria, ActividadeSecundaria, ActividadeTerciaria, Carreira, Categoria, Centro, Comuna, Distrito, Email, Especialidade, EstadoCivil, Meses, Municipios, NaturezaJuridica, NivelAcademico, Pais, Profissao, Provincias, Regime, Sexo, SituacaoCadastro, SituacaoMotivo, TipoVinculo } from '@app/models';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import staticData from '@assets/static/local-data.json';

const fullUrl = `${environment.apiUrl}${environment.apiPath}`;
const baseUrl = `${environment.apiUrl}`;


@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {

  opts = [];
  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  BuscaFoto(Id) {
    return this.http.get(fullUrl + '/Trabalhador_Fotos/' + Id);
  }

  BuscaSexo() {
    return staticData.sexo;
  }

  ListaNacionalidade() {
    return staticData.nacionalidades;
  }

  ListaNivelAcademico() {
    return staticData.nivel_academico;
  }

  getSituacaoMotivo() {
    return staticData.situacao_motivo;
  }

  getCountries(){
    return staticData.countries;
  }

  ListaTipoVinculo(){
    return staticData.tipo_vinculo;
  }

  ListarCentros(){
    return staticData.centros;
  }

  ListaSituacaoCadastro(){
    return staticData.situacao_cadastro;
  }

  ListaRegime(){
    return staticData.regime;
  }

  ListaProvincia(){
    return staticData.provincias;
  }

  getCarreira(){
    return staticData.carreira;
  }

  ListaSexo(){
    return staticData.sexo;
  }

  EstadoCivil(){
    return staticData.estado_civil;
  }

  getCountries2(){
    return staticData.countries2;
  }

  getMunicipio(){
    return staticData.municipio;
  }

  getCategoria(){
    return staticData.categorias;
  }
  
  getDistrito() {
    return staticData.distritos;
  }

  getComuna() {
    return staticData.comuna;
  }

  enviaEmail(request: Email): Observable<Email> {
    request.apikey = 'INS1395983150';
    request.from = 'INEFOP';
    request.to = '2449232585032';
    request.message = 'ola muhato';

    return (
      this.http
        .post<Email>('https://www.cupplus.co.ao/smsapp/apis/smscontact/', request)
        // tslint:disable-next-line: variable-name
        .pipe(tap((_pessoa: Email) => console.log(request)))
      // https://www.cupplus.co.ao/smsapp/apis/smscontact/?apikey=INS1395983150&from=INEFOP&to=244922285032&message=Teste%20homologacao
    );
  }
}
