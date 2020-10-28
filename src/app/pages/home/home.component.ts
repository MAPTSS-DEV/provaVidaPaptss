import { CadastroComponent } from './../../components/cadastro/cadastro.component';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Pagamentos, ResumoGeral, User } from '@app/models';
import { AccountService, CadastroService, GeraisService } from '@app/services';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { FilesDataSource } from '@app/helpers/datasource';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;
    trabalhadores: any;
    contacts: any;
    user: any;

    dataSource: FilesDataSource | null;
    displayedColumns = ['Id', 'Nome', 'B.I', 'NumAgente', 'Unidade', 'Situacao', 'Accao'];
    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    //  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    isIndeterminate: boolean;

    hasSelectedContacts: boolean;
    searchInput: FormControl;
    employeeInfoTable: Pagamentos[] = [];
    resumo: ResumoGeral[] = [];
    // people: pessoa[] = [];
    resum: Observable<ResumoGeral[]>;
    employeeInfoTableDataSource = new MatTableDataSource(this.employeeInfoTable);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    selection = new SelectionModel<Pagamentos>(true, []);
    unselectedRows: Array<{}> = [];
    // Private
    // private _unsubscribeAll: Subject<any>;

    filterForm = new FormGroup({
        fromDate: new FormControl(),
        toDate: new FormControl(),
    });
    // pipe: DatePipe;



    constructor(
        // tslint:disable-next-line: variable-name
        public _matDialog: MatDialog,
        // tslint:disable-next-line: variable-name
        private _PagamentosService: GeraisService,
        public servico: CadastroService,
        public matDialogRef: MatDialogRef<CadastroComponent>,
        private spinner: NgxSpinnerService,
        // tslint:disable-next-line: variable-name
        @Inject(MAT_DIALOG_DATA) public _data: any
    ) {

        this.searchInput = new FormControl('');
    }

    // tslint:disable-next-line: typedef
    ngOnInit() {

        /** spinner starts on init */
        this.spinner.show();
        this.user = localStorage.getItem('user');
        this._PagamentosService.BuscaPagamentos().subscribe(response => {
            this.employeeInfoTable = response;
            // console.log(response);
            this.employeeInfoTableDataSource.data = this.employeeInfoTable;
            this.employeeInfoTableDataSource.paginator = this.paginator;
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
        });

        if (this.servico.subsVar === undefined) {
            this.servico.subsVar = this.servico.EmitirEvento.subscribe((res) => this.onRefresh());
        }
    }

    // tslint:disable-next-line: typedef
    get fromDate() { return this.filterForm.get('fromDate').value; }
    // tslint:disable-next-line: typedef
    get toDate() { return this.filterForm.get('toDate').value; }

    // tslint:disable-next-line: typedef
    onRefresh() {
        this.ngOnInit();
    }

    // tslint:disable-next-line: typedef
    searchdata() {
        // tslint:disable-next-line: no-debugger
        debugger;
        this._PagamentosService.searhhdata(this.trabalhadores).subscribe((res: any) => {

            this.contacts = res;
            console.log(this.contacts);
        });
    }



    FormCadastro(trab): void {
        //    console.log(trab);
        this.matDialogRef = this._matDialog.open(CadastroComponent, {
            width: '790px',
            height: '800px',
            data: {
                trabalhador: trab,
                action: 'edit'
            },
            disableClose: true
        });


        this.matDialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
            });
    }


    // tslint:disable-next-line: typedef
    procurar() {
        // console.log(this.fromDate);
        this.employeeInfoTableDataSource.filterPredicate = (data) => {
            //   if (this.fromDate && this.toDate) {
            console.log(this.fromDate);
            return new Date(data.datapagamento).getTime() >= this.fromDate.getTime() &&
                new Date(data.datapagamento).getTime() <= this.toDate.getTime();
            //   }
            //   return true;
        };
    }

    // tslint:disable-next-line: typedef
    filtrarData() {
        //  console.log(this.toDate);
        this.employeeInfoTableDataSource.data = this.employeeInfoTable;
        // const d = this.toDate.addHours(24);
        this.toDate.setDate(this.toDate.getDate() + 1);
        const resultProductData = this.employeeInfoTableDataSource.data.filter(a => {
            //  this.employeeInfoTableDataSource.data = this.employeeInfoTableDataSource.data.filter(a => {
            const date = new Date(a.datapagamento);
            return (date >= this.fromDate && date <= this.toDate);
        });
        this.employeeInfoTableDataSource.data = resultProductData;
        // console.log(resultProductData);
    }

    // tslint:disable-next-line: typedef
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.employeeInfoTableDataSource.filter = filterValue.trim().toLowerCase();
    }

    // tslint:disable-next-line: typedef
    applyFilter2() {
        const startDate = new Date('04-08-2019');
        const endDate = new Date('08-12-2020');
        this.employeeInfoTableDataSource.data = this.employeeInfoTableDataSource.data.filter(m => m.datapagamento > startDate && m.datapagamento < endDate);
    }

    store() {
        setTimeout(() => {
            this.unselectedRows = this.selection.selected;
            const contactIndex = this.unselectedRows.slice(2, 1);
        });
    }
}