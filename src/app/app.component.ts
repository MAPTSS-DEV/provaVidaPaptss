import { AccountService } from '@app/services';
import { Component } from '@angular/core';
import { User } from '@app/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'provaVidaPaptss';
  user: User;
  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  get isAdmin() {
    // return this.user && this.user.role === Role.Admin;
    return true;
  }

  logout() {
    this.accountService.logout();
  }
}
