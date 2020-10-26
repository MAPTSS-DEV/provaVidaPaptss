import { Component } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { AuthGuard } from '@app/helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'provaVidaPaptss';
  mostrarMenu = false;
  constructor(private AuthG: AuthGuard) {
    this.AuthG.mostrarMenuEmiter.subscribe(
      mostrar => this.mostrarMenu = mostrar
    );
  }

  public webcamImage: WebcamImage = null;
  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }
}
