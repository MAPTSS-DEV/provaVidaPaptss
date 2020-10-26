import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CadastroService, CameraService } from '@app/services';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CadastroComponent } from '..';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  idTrabalhador;
  constructor(
    // tslint:disable-next-line: variable-name
    public _matDialog: MatDialog,
    public cameraservico: CameraService,
    public servico: CadastroService,
    public matDialogRef: MatDialogRef<CadastroComponent>,
    // tslint:disable-next-line: variable-name
    @Inject(MAT_DIALOG_DATA) public _data: any,
    public cameraDialogRef: MatDialogRef<CameraComponent>) {
    console.log(_data.trabalhador);
    this.idTrabalhador = _data.trabalhador;
    //    this.CadastroForm.patchValue( _data.trabalhador[0]);
  }

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;
  imageFile: File;
  imageHash: string;
  fileUploadSub: Subscription;
  blobSub: Subscription;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  public ngOnInit(): void {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
      return;
    }
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    // this.OnSubmit();
  }

  // Novo  metodo para resetar o formulario de imagem
  getNewPic() {
    this.webcamImage = null;
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);

    /*  Swal.fire({
       icon: 'error',
       title: 'Oops...',
       text: 'Erro ao conectar a webcam!',
     //  footer: '<a href>Why do I have this issue?</a>'
     }); */
  }


  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    // tslint:disable-next-line: no-console
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.blobSub = this.dataURItoBlob(webcamImage.imageAsBase64).subscribe((blob) => {
      const imageBlob: Blob = blob;
      const imageName = this.idTrabalhador + '.jpeg';
      this.imageFile = new File([imageBlob], imageName, { type: 'image/jpeg', });
      console.log('imageFile', this.imageFile);
    },
      (err) => console.error(err),
      () => console.log('complete')
    );
  }
  OnSubmit(): void {
    //  console.log(this.PessoaForm);
    //  if (this.PessoaForm.valid) {
    const formData: FormData = new FormData();
    console.log(this.imageFile);
    formData.append('Image', this.imageFile, this.imageFile.name);
    formData.append('Id_Trabalhador', this.idTrabalhador);
    this.cameraservico.Actualiza(formData).subscribe(res => {
      //   this.servico.EmitirEvento.emit();
      console.log(formData);
      // this.configService.showAlert('Solicitação feita com sucesso', 'alert-success' , true);
      // this.reset();
      // this.message.openInfoModal('Atualização feita com sucesso');
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Atualização feita com sucesso',
        showConfirmButton: false,
        timer: 3500
      });
      // this.close();
      //  this.servico.EmitirEvento.emit();
      this.cameraservico.EmitirFotoEvento.emit();
      // this.solicitacao = this.service.getSolicitacao();
      this.dismissModal();
    }
      ,
      err => {
        console.log(err);
        //   this.message.openErrorModal('Ocorreu um erro ao enviar a solicitação, por favor contacte o administrador do sistema');
      });
    // }

  }

  public dismissModal(){
    this.cameraDialogRef.close();
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }


  /* Method to convert Base64Data Url as Image Blob */
  dataURItoBlob(dataURI: string): Observable<Blob> {
    // tslint:disable-next-line: deprecation
    return Observable.create((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], { type: 'image/jpeg' });
      observer.next(blob);
      observer.complete();
    });
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

}
