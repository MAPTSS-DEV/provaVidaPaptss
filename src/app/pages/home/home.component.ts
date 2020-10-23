import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { BookService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    user: User;
    bookList: any;
    params: any = {};

    constructor(private accountService: AccountService, private bookSrvc: BookService) {
        this.user = this.accountService.userValue;
    }

    ngOnInit(): void {
        // this.params.limit = 10;
        // this.params.page = 1;
        // this.loadData();
    }

    loadData() {
        this.bookSrvc.load(this.params).subscribe((response: any) => {
            console.log('All books loaded sucessfull', response);
            this.bookList = response.content.data;
        }, error => {
            console.log('Error loading books', error);

        });
    }
}