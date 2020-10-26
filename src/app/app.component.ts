import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { AuthGuard } from '@app/helpers';
import { AccountService } from '@app/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'provaVidaPaptss';
  mostrarMenu = false;
  constructor(private AuthG: AuthGuard, public accountSrvc: AccountService) {
    this.AuthG.mostrarMenuEmiter.subscribe(
      mostrar => this.mostrarMenu = mostrar
    );
  }

  public webcamImage: WebcamImage = null;
  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

  logout() {
    this.accountSrvc.logout();
  }
}
