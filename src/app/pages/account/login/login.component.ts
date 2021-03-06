﻿import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/services';
import Swal from 'sweetalert2';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.spinner.show();
        this.accountService.userAuthentication(this.form.value).subscribe((response: any) => {
            console.log('Response after login', response);
            localStorage.setItem('userToken', response.access_token);
            localStorage.setItem('user', this.f.username.value);
            localStorage.setItem('role', response.Role);
            localStorage.setItem('id', response.IdUsuario);
            localStorage.setItem('loginStatus', '1');
            this.loading = false;
            this.spinner.hide();
            this.router.navigate(['/home']);
            console.log('Passou');

        }, (err) => {
            console.log('Ocorreu um erro ao fazer login', err);
            this.loading = false;
            this.spinner.hide();
            Swal.fire({
                position: 'center',
                icon: "error",
                title: `Erro ao Iniciar sessão com user ${this.form.value.username}, contacte o administrador.`,
                showConfirmButton: false,
                timer: 3500
            });
        });
        // this.accountService.login(this.f.username.value, this.f.password.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.router.navigate([this.returnUrl]);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
    }
}