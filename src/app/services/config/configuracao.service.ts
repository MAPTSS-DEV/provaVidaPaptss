import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActividadePrimaria, ActividadeSecundaria, ActividadeTerciaria, Carreira, Categoria, Centro, Comuna, Distrito, Email, Especialidade, EstadoCivil, Meses, Municipios, NaturezaJuridica, NivelAcademico, Pais, Profissao, Provincias, Regime, Sexo, SituacaoCadastro, SituacaoMotivo, TipoVinculo } from '@app/models';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';

const fullUrl = `${environment.apiUrl}${environment.apiPath}`;
const baseUrl = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {

  opts = [];
  constructor(private http: HttpClient) {}

  // tslint:disable-next-line: typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  BuscaMeses(): Observable<Meses[]> {
    return this.http.get<Meses[]>(fullUrl + '/Meses').pipe(
      tap(heroes => console.log('Mês carregado com sucesso')),
      catchError(this.handleError('getPessoas', []))
    );
  }
  BuscaActividadePrimaria(): Observable<ActividadePrimaria[]> {
    return this.http.get<ActividadePrimaria[]>(fullUrl + '/Actividade_Primaria').pipe(
      tap(heroes => console.log('Actividade Primaria carregado com sucesso')),
      catchError(this.handleError('getPessoas', []))
    );
  }

  BuscaActividadeSecundaria(): Observable<ActividadeSecundaria[]> {
    return this.http.get<ActividadeSecundaria[]>(fullUrl + '/Actividade_Secundaria').pipe(
      tap(heroes => console.log('Actividade Secundaria carregado com sucesso')),
      catchError(this.handleError('getPessoas', []))
    );
  }


  BuscaActividadeSecPorIdPrimaria(id): Observable<ActividadeSecundaria[]> {
    return this.http.get<ActividadeSecundaria[]>(fullUrl + '/Actividade_Secundaria').pipe(
      tap(heroes => console.log('Actividade Secundaria carregado com sucesso')),
        map((actividadeSecundaria: ActividadeSecundaria[]) => actividadeSecundaria.filter(c => c.id_Actividade_Primaria = id)),
      catchError(this.handleError('getPessoas', []))
    );
  }
  BuscaActividadeTercearia(): Observable<ActividadeTerciaria[]> {
    return this.http.get<ActividadeTerciaria[]>(fullUrl + '/Actividade_Tercearia');
   // .pipe(
      // tap(heroes => console.log('Actividade Tercearia carregado com sucesso')),
      //  map((actividadeTerciaria: ActividadeTerciaria[]) => actividadeTerciaria.filter(c => c.id_Actividade_secundaria = id)),
     // catchError(this.handleError('getPessoas', []))
   //  );
  }
  BuscaFoto(Id) {
    return this.http.get(fullUrl + '/Trabalhador_Fotos/' + Id);
  }

  BuscaActividadeTecPorIdSecundaria(id): Observable<ActividadeTerciaria[]> {
    return this.http.get<ActividadeTerciaria[]>(fullUrl + '/Actividade_Tercearia/' + id)
    .pipe(
      tap(heroes => console.log('Actividade Tercearia carregado com sucesso')),
       /*  map((actividadeTerciaria: ActividadeTerciaria[]) => actividadeTerciaria.filter(c => c.id_Actividade_secundaria = id)),*/
      catchError(this.handleError('getPessoas', []))
    );
  }


  BuscaNaturezaJuridica(): Observable<NaturezaJuridica[]> {
    return this.http
      .get<NaturezaJuridica[]>(fullUrl + '/Natureza_Juridica')
      .pipe(
        tap(heroes => console.log('Natureza carregado com sucesso')),
        catchError(this.handleError('getPessoas', []))
      );
  }

  // tslint:disable-next-line: typedef
  BuscaProvincias() {
    return  this.http.get<Provincias>(fullUrl + '/Provincias');
  }

  // tslint:disable-next-line: typedef
  BuscaSexo() {
    return  this.http.get<Sexo[]>(fullUrl + '/Genero');
  }

  // tslint:disable-next-line: typedef
  BuscaMunicipios() {
    return  this.http.get<Municipios>(fullUrl + '/Municipios' ).pipe(
      catchError(this.handleError('getPessoas', []))
    );
  }

  // tslint:disable-next-line: typedef
  BuscaMunicipioPorIdProvincia(id) {
    return id ?  this.http.get<Municipios[]>(fullUrl + '/Municipios/' + id )
    .pipe(
     // map((municipios: Municipios[]) => municipios.filter(c => c.Id_Provincia = id))
      catchError(this.handleError('getPessoas', []))
    ) : new Observable<Municipios[]>();
  }
  BuscaSituacaoMotivo(id) {
    return  this.http.get<SituacaoMotivo[]>(fullUrl + '/SituacaoMotivo/' + id )
    .pipe(
     // map((municipios: Municipios[]) => municipios.filter(c => c.Id_Provincia = id))
      catchError(this.handleError('getPessoas', []))
    );
  }
  Profissao(): Observable<Profissao[]> {
    return this.http.get<Profissao[]>(fullUrl + '/Profissao').pipe(
      tap(heroes => console.log('Nacionalidade carregado com sucesso')),

      catchError(this.handleError('getPessoas', []))
    );
  }

  // tslint:disable-next-line: typedef
  verificarProfissao(prof: string) {
    //  console.log('verificaProfissao');
    return this.http.get(fullUrl + '/Profissao')
      .pipe(
       // tap(heroes => console.log('match')),  answer = (answer?answer:'').toLowerCase();
        delay(1000),
        map((dados: Profissao[]) => dados.filter(v => v.Profissao_Tercearia.toLowerCase() === (prof ? prof : '').toLowerCase())),
        // tap(heroes => console.log(v.Profissao_Tercearia.trimRight().toLowerCase())),
        map((dados: Profissao[]) => dados.length > 0 )
      );

  }


// tslint:disable-next-line: typedef
getData() {
  return this.opts.length ?
    of(this.opts) :
    this.http.get<any>(fullUrl + '/Profissao').pipe(tap(data => this.opts = data));
}

  ListaNacionalidade(): Observable<Pais[]> {
    return this.http.get<Pais[]>(fullUrl + '/Paises').pipe(
      tap(heroes => console.log('Nacionalidade carregado com sucesso')),
    //  map((Nac: Nacionalidade[]) => Nac.filter(c => c.Nacionalidade !== 'ANGOLA')),
      catchError(this.handleError('getPessoas', []))
    );
  }
  ListaNivelAcademico(): Observable<NivelAcademico[]> {
    return this.http.get<NivelAcademico[]>(fullUrl + '/NivelAcademico').pipe(
      tap(heroes => console.log('NivelAcademico carregado com sucesso')),
    //  map((Nac: Nacionalidade[]) => Nac.filter(c => c.Nacionalidade !== 'ANGOLA')),
      catchError(this.handleError('getPessoas', []))
    );
  }
  ListaTipoVinculo(): Observable<TipoVinculo[]> {
    return this.http.get<TipoVinculo[]>(fullUrl + '/TipoVinculo').pipe(
           catchError(this.handleError('TipoVinculo', []))
    );
  }
  ListaSituacaoCadastro(): Observable<SituacaoCadastro[]> {
    return this.http.get<SituacaoCadastro[]>(fullUrl + '/SituacaoCadastro').pipe(
           catchError(this.handleError('SituacaoCadastro', []))
    );
  }
  ListaRegime(): Observable<Regime[]> {
    return this.http.get<Regime[]>(fullUrl + '/Regime').pipe(
           catchError(this.handleError('Regime', []))
    );
  }

  ListaEspecialidade(): Observable<Especialidade[]> {
    return this.http.get<Especialidade[]>(fullUrl + '/Especialidades').pipe(
      tap(heroes => console.log('Especialidades carregado com sucesso')),
    //  map((Nac: Nacionalidade[]) => Nac.filter(c => c.Nacionalidade !== 'ANGOLA')),
      catchError(this.handleError('getPessoas', []))
    );
  }

  ListaProvincia(): Observable<Provincias[]> {
    return this.http.get<Provincias[]>(fullUrl + '/Provincias').pipe(
      tap(heroes => console.log('Provincias carregado com sucesso')),
    //  map((Nac: Provincias[]) => Nac.filter(c => c.Id_Provincia !== 'ANGOLA')),
      catchError(this.handleError('getPessoas', []))
    );
  }


  ListaSexo(): Observable<Sexo[]> {
    return this.http.get<Sexo[]>(fullUrl + '/Genero').pipe(
      tap(heroes => console.log('Sexo carregado com sucesso')),
    //  map((Nac: Provincias[]) => Nac.filter(c => c.Id_Provincia !== 'ANGOLA')),
      catchError(this.handleError('Sexo', []))
    );
  }

  EstadoCivil(): Observable<EstadoCivil[]> {
    return this.http.get<EstadoCivil[]>(fullUrl + '/EstadoCivil').pipe(
      tap(heroes => console.log('EstadoCivil carregado com sucesso')),
    //  map((Nac: Provincias[]) => Nac.filter(c => c.Id_Provincia !== 'ANGOLA')),
      catchError(this.handleError('EstadoCivil', []))
    );
  }

  Centros(): Observable<Centro[]> {
    return this.http.get<Centro[]>(fullUrl + '/Centros').pipe(
      tap(heroes => console.log('Centros carregado com sucesso')),
    //  map((Nac: Provincias[]) => Nac.filter(c => c.Id_Provincia !== 'ANGOLA')),
      catchError(this.handleError('Centros', []))
    );
  }

  // tslint:disable-next-line: typedef
  ListaProvinciaFromPais(id) {
    return  this.http.get<Provincias[]>(fullUrl + '/Provincias')
    .pipe(
     map((provincias: Provincias[]) => provincias.filter(c => c.Id_Pais === id)),
   //  tap(console.log),
      catchError(this.handleError('getPessoas', []))
    );
  }
  // tslint:disable-next-line: typedef
  ListaMunicipio(id) {

    return  this.http.get<Municipios[]>(fullUrl + '/MunicipiosNovo/')
    .pipe(
     map((municipios: Municipios[]) => municipios.filter(c => c.Id_Provincia === id)),
   //  tap(console.log),
      catchError(this.handleError('getPessoas', []))
    );
  }
    // tslint:disable-next-line: typedef
    ListaComuna(id) {
      return  this.http.get<Comuna[]>(fullUrl + '/ComunaNovo/' + id)
      .pipe(
        catchError(this.handleError('Comuna', []))
      );
    }
    ListaCarreira(id) {
      return  this.http.get<Carreira[]>(fullUrl + '/Carreiras/' + id)
      .pipe(
        catchError(this.handleError('Carreiras', []))
      );
    }
    ListaCategoria(id) {
      return  this.http.get<Categoria[]>(fullUrl + '/Categorias/' + id)
      .pipe(
        catchError(this.handleError('Categorias', []))
      );
    }
    ListaDistrito(id) {
      return  this.http.get<Distrito[]>(fullUrl + '/DistritosNovo/' + id)
      .pipe(
        catchError(this.handleError('Comuna', []))
      );
    }

    Comuna(id) {
      return  this.http.get<Comuna[]>(fullUrl + '/Comuna/' + id)
      .pipe(
        catchError(this.handleError('Comuna', []))
      );
    }
    Distrito(id) {
      return  this.http.get<Distrito[]>(fullUrl + '/Distritos/' + id)
      .pipe(
        catchError(this.handleError('Comuna', []))
      );
    }


  enviaEmail(request: Email): Observable<Email> {
    request.apikey = 'INS1395983150';
    request.from = 'INEFOP';
    request.to = '2449232585032';
    request.message = 'ola muhato';

    return (
      this.http
        .post<Email>('https://www.cupplus.co.ao/smsapp/apis/smscontact/' , request )
        // tslint:disable-next-line: variable-name
        .pipe(tap((_pessoa: Email) => console.log(request)))
        // https://www.cupplus.co.ao/smsapp/apis/smscontact/?apikey=INS1395983150&from=INEFOP&to=244922285032&message=Teste%20homologacao
    );
  }
}
