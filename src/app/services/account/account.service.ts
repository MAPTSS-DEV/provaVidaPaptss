import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/models';
import { FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { tap, catchError, map, delay, timeout } from 'rxjs/operators';
import { Role } from '@app/models/role';
import { Router } from '@angular/router';

const fullUrl = `${environment.apiUrl}${environment.apiPath}`;
const baseUrl = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class AccountService {

    static criarNovoUsuario = new EventEmitter();
    dados = {
        usuario: null,
        senha: null
    };
    emitirUsuarioCriado = new EventEmitter();
    invokeFirstComponentFunction = new EventEmitter();
    subsVar: Subscription;

    // trabalhador: Trabalhador[];
    ontrabalhadorChanged: BehaviorSubject<any>;
    onSelectedtrabalhadorChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    // trabalhador: Contact[];
    selectedtrabalhador: string[] = [];

    searchText: string;
    filterBy: string;
    Trab: any;

    // User related properties
    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
    private UserName = new BehaviorSubject<string>(localStorage.getItem('user'));
    private UserRole = new BehaviorSubject<string>(localStorage.getItem('role'));
    user: User;

    constructor(private http: HttpClient, public router: Router) { }

    // tslint:disable-next-line: typedef
    get isLoggesIn() {
        return this.loginStatus.asObservable();
    }

    // tslint:disable-next-line: typedef
    get currentUserName() {
        return this.UserName.asObservable();
    }

    // tslint:disable-next-line: typedef
    get currentUserRole() {
        return this.UserRole.asObservable();
    }

    // tslint:disable-next-line: typedef
    registerUser(user: User) {
        const body: User = {
            Id_Usuario: user.Id_Usuario,
            Usuario: user.Usuario,
            Status: user.Status,
            Senha: user.Senha,
            Data_Registo: new Date(),
            Id_Perfil: user.Id_Perfil


            /* 
                Id_Usuario: number;
         Usuario: string;
         Senha: string;
         Status: string;
         Id_Perfil: number;
         Data_Registo: Date;
            */

        };

        const reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
        return this.http.post(fullUrl + '/AspNetUsers/', body, { headers: reqHeader });
    }

    // tslint:disable-next-line: typedef
    registerUser2(user: FormGroup) {
        //  console.log(user);

        const reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
        //  const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
        return this.http.post(fullUrl + '/CadastroContas/', user, { headers: reqHeader });
    }

    // tslint:disable-next-line: typedef
    BuscaRole() {
        return this.http.get<Role[]>(fullUrl + '/AspNetRoles');
    }
    // tslint:disable-next-line: typedef
    userAuthentication(formValue) {
        const data = 'username=' + formValue.username + '&password=' + formValue.password + '&grant_type=password';
        const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
        return this.http.post(`${baseUrl}/token`, data, { headers: reqHeader })
        .pipe(
            timeout(13000)
        );
    }

    BuscaUsuarios(): Observable<User[]> {
        return this.http.get<User[]>(fullUrl + '/AspNetUsers').pipe(
            // share(),
            // console.log(Object(response).data)
            tap(heroes => console.log('Dados Carregados')),

            catchError(this.handleError('BuscaUsuarios', []))
        );
    }

    ListaUsuario(): Observable<User[]> {
        //    console.log(localStorage.getItem('id'));
        return this.http.get<User[]>(fullUrl + '/AspNetUsers/' + localStorage.getItem('id'));
        //  .map(res => res); 
    }
    // tslint:disable-next-line: typedef
    carrega() {

        return this.http.get<User>(fullUrl + '/AspNetUsers/' + localStorage.getItem('id'));
    }
    // tslint:disable-next-line: typedef
    ativar(id) {
        return this.http.get<any>(fullUrl + '/Activar/' + id);
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

    create(request: User): Observable<User> {

        return this.http
            .post<User>(fullUrl + '/AspNetUsers/', request)
            // tslint:disable-next-line:variable-name
            .pipe(tap((_pessoa: User) => console.log(request)

            ));

    }

    // tslint:disable-next-line: typedef
    updateUtilizador(Usuarios: User) {
        return this.http.put(fullUrl + '/Utilizador/' + this.user.Id_Usuario, Usuarios);
    }

    // tslint:disable-next-line: typedef
    update(Usuarios: User) {
        return this.http.put(fullUrl + '/AspNetUsers/' + this.user.Id_Usuario, Usuarios);
    }

    // tslint:disable-next-line: typedef
    eliminar(user: User) {
        return this.http.post<any>(fullUrl + '/EliminaUtilizador', user);
        // .pipe(tap((pessoa: pessoa) => console.log(id)));
    }


    // tslint:disable-next-line: typedef
    eliminar2(id) {
        return this.http.delete<User>(fullUrl + '/AspNetUsers/' + id);
    }



    // tslint:disable-next-line: typedef
    getUserClaims() {
        return this.http.get(fullUrl + '/GetUserClaims');
    }

    roleMatch(allowedRoles): boolean {
        let isMatch = false;
        const userRoles: string[] = JSON.parse(localStorage.getItem('Role'));
        allowedRoles.forEach(element => {
            if (userRoles.indexOf(element) > -1) {
                isMatch = true;
                return false;
            }
        });
        return isMatch;

    }

    checkLoginStatus(): boolean {

        const loginCookie = localStorage.getItem('loginStatus');

        if (loginCookie === '1') {
            // this.loginStatus.next(true);
            return true;
        }
        return false;
    }

    Login(usuario, senha): Observable<any> {
        const data = '?usuario=' + usuario + '&senha=' + senha;
        return this.http.get<any>(fullUrl + '/Login' + data);
    }

    IdEmpresa(id): Observable<any> {
        return this.http.get<any>(fullUrl + '/BuscaIdEmpresaIdUsuario/' + id);
    }

    // tslint:disable-next-line: typedef
    ValidarUsuario(userName, password) {
        const data = '?usuario=' + userName + '&senha=' + password + '&grant_type=password';
        const reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
        return this.http.get(fullUrl + '/login' + data); // , { headers: reqHeader });
    }

    // tslint:disable-next-line: typedef
    verificarUsuario(usuario: string) {
        return this.http.get(fullUrl + '/AspNetUsers')
            .pipe(
                delay(2000),
                // map((dados: {emails: any[]}) => dados.emails),
                // tap(console.log),
                map((dados: User[]) => dados.filter(v => v.Usuario === usuario)),
                // tap(console.log),
                map((dados: any[]) => dados.length > 0)
                // tap(console.log)
            );
    }

    onFirstComponentButtonClick(): void {
        this.invokeFirstComponentFunction.emit();
    }
    toggleSelectedContact(id): void {
        // First, check if we already have that contact as selected...
        // console.log(id);

        if (this.selectedtrabalhador.length > 0) {
            //   console.log('length maior de 0');
            const index = this.selectedtrabalhador.indexOf(id);

            if (index !== -1) {
                // console.log(this.selectedtrabalhador);
                // console.log(this.selectedtrabalhador.splice(index, 1));
                this.selectedtrabalhador.splice(index, 1);
                //  console.log(this.selectedtrabalhador);
                // Trigger the next event
                this.onSelectedtrabalhadorChanged.next(this.selectedtrabalhador);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedtrabalhador.push(id);
        // this.deleteSelectedtrabalhador();
        // Trigger the next event
        // this.onSelectedtrabalhadorChanged.next(this.selectedtrabalhador);
        // console.log(this.selectedtrabalhador);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedtrabalhador.length > 0) {
            this.deselecttrabalhador();
        }
        else {
            //    this.selecttrabalhador();
        }
    }
    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateContact(contact): Promise<any> {
        return new Promise((resolve, reject) => {

            this.http.post('api/trabalhador-trabalhador/' + contact.id, { ...contact })
                .subscribe(response => {
                    //     this.gettrabalhador();
                    resolve(response);
                });
        });
    }


    // tslint:disable-next-line: typedef
    getTrabalhador() {
        return this.http.get(fullUrl + '/Trabalhadors').toPromise();
    }

    // tslint:disable-next-line: typedef
    getTrabalhadorList() {
        return this.http.get(fullUrl + '/Trabalhadors');
    }
    // tslint:disable-next-line: typedef
    NumTrabalhador() {
        return this.http.get(fullUrl + '/SEQTrabalhador/').toPromise();
        // .toPromise();
    }

    deselecttrabalhador(): void {
        this.selectedtrabalhador = [];

        // Trigger the next event
        this.onSelectedtrabalhadorChanged.next(this.selectedtrabalhador);
    }

    logout(): void {
        // this.userService.isLoggesIn(false);
        //  localStorage.setItem('loginStatus', '0');
        //  localStorage.setItem('idEmpresa', '0');
        localStorage.removeItem('userToken');
        localStorage.removeItem('loginStatus');
        localStorage.removeItem('idEmpresa');
        localStorage.removeItem('user');
        localStorage.removeItem('NomeEmpresa');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        this.router.navigateByUrl('/account/login');

    }


}