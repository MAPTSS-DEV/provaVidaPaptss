﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/services';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    roles = [];
    dropdownSettings: IDropdownSettings = { 
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        allowSearchFilter: true,
        maxHeight: 200
      };

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        this.loadRoles();

        this.form = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', Validators.required],
            active: ['', Validators.required],
            dob: ['', Validators.required],
            genre: ['', Validators.required],
            roles: [[]]
            // password: ['', passwordValidators]
        });

        if (!this.isAddMode) {
            // this.accountService.getById(this.id)
            //     .pipe(first())
            //     .subscribe((x:any) => {
            //         this.f.first_name.setValue(x.content.first_name);
            //         this.f.last_name.setValue(x.content.last_name);
            //         this.f.email.setValue(x.content.email);
            //         this.f.active.setValue(x.content.active);
            //         this.f.dob.setValue(x.content.dob);
            //         this.f.genre.setValue(x.content.genre);
            //         this.f.roles.setValue(x.content.roles);
            //     });
        }
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
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        // this.accountService.register(this.form.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.alertService.success('User added successfully', { keepAfterRouteChange: true });
        //             this.router.navigate(['.', { relativeTo: this.route }]);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
    }

    private updateUser() {
        // this.accountService.update(this.id, this.form.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.alertService.success('Update successful', { keepAfterRouteChange: true });
        //             this.router.navigate(['..', { relativeTo: this.route }]);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
    }

    loadRoles(){
        // this.accountService.roles().subscribe((response: any) => {
        //     console.log(' loaded sucessfull', response);
        //     this.roles = response.content;
        //   }, error => {
        //     console.log('Error loading books', error);
        //   });
    }
}