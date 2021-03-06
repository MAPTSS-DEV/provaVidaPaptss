import { FIELDS_FORM_COMPLEMENTARES, FIELDS_FORM_PERSON, FIELDS_FORM_VINCULO } from './../../../assets/static/data';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cadastro, Carreira, Categoria, Centro, Comuna, Distrito, EstadoCivil, Municipios, NivelAcademico, Pais, Provincias, Regime, Sexo, SituacaoCadastro, SituacaoMotivo, TipoVinculo } from '@app/models';
import { CadastroService, CameraService, ConfiguracaoService } from '@app/services';
import { Observable, Observer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CameraComponent } from '..';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };
  CadastroForm: FormGroup;

  cadastro: Cadastro[] = [];
  fileToUpload: File = null;
  vfile;
  selectedTabIndex = 0;
  hasError = false;
  fieldError = '';

  // Pais : Pais;
  prov: Provincias[];
  provMorada: Provincias[];
  Mun: Municipios[];
  MunMorada: Municipios[];
  Comun: Comuna[];
  distrito: Distrito[];
  ComuMorada: Comuna[];
  distritoMorada: Distrito[];
  nacionalidade: Pais[];
  nivelAcademico: NivelAcademico[];
  tipoVinculo: TipoVinculo[];
  regime: Regime[];
  carreira: Carreira[];
  categoria: Categoria[];
  sexo: Sexo[];
  estadocivil: EstadoCivil[];
  centro: Centro[];
  situacao: SituacaoCadastro[];
  Motivo: SituacaoMotivo[];
  videoWidth = 0;
  videoHeight = 0;

  imageUrl;
  motivoEstado = false;

  imageSpinner = '/assets/avatar.png';
  // imageSpinner = '/assets/loadinSpinner.gif';
  // tslint:disable-next-line: variable-name
  constructor(private _formBuilder: FormBuilder,
              private config: ConfiguracaoService,
              private renderer: Renderer2,
              private service: CadastroService,
              private cameraservico: CameraService,
    // tslint:disable-next-line: variable-name
              public _matDialog: MatDialog,
              public cameraDialogRef: MatDialogRef<CameraComponent>,
              public cadastroDialogRef: MatDialogRef<CadastroComponent>,
              private spinner: NgxSpinnerService,
    // tslint:disable-next-line: variable-name
              @Inject(MAT_DIALOG_DATA) public _data: any) {
    //   console.log(_data.trabalhador);
    // this.cadastro = _data.trabalhador;
    //    this.CadastroForm.patchValue( _data.trabalhador[0]);
  }

  ngOnInit(): void {
    this.CadastroForm = this._formBuilder.group({
      Id_Trabalhador: [''],
      Trabalhador: ['', Validators.required],
      TrabalhadorNomeCorrigido: [''],
      Telefone: [''],
      Nome_Pai: [''],
      Nome_Mae: [''],
      DataNascimento: ['', Validators.required],
      id_estado_civil: ['', Validators.required],
      SegSocial: ['', Validators.required],
      DataEmissao: ['', Validators.required],
      DataValidade: ['', Validators.required],
      Documento: ['', Validators.required],
      NIF: ['', Validators.required],
      Id_sexo: ['', Validators.required],
      LocalEmissao: ['', Validators.required],

      Id_Nacionalidade: ['', Validators.required],
      Id_Provincia: ['', Validators.required],
      Id_Municipio: ['', Validators.required],
      Situacao: ['', Validators.required],
      Motivo: ['', Validators.required],
      Foto: [''],
      Bairro: ['', Validators.required],

      Id_Distrito: ['', Validators.required],
      Id_Comuna: ['', Validators.required],
      Id_Trabalhador_Vinculo: ['', Validators.required],
      Id_Tipo_Viculo: ['', Validators.required],
      Data_Admissao: ['', Validators.required],
      Id_Centro: ['', Validators.required],
      Funcao: ['', Validators.required],
      Id_Regime: ['', Validators.required],
      Id_Carreira: ['', Validators.required],
      Id_Categoria: ['', Validators.required],
      Id_Nivel_Academico: ['', Validators.required],
      Centro_Id_Provincia: ['', Validators.required],
      Residencia: ['', Validators.required],
      Id_ProvinciaMorada: ['', Validators.required],
      Id_MunicipioMorada: ['', Validators.required],
      BairroMorada: ['', Validators.required],
      Id_Morada: ['', Validators.required],
      Id_ComunaMorada: ['', Validators.required],
      Id_DistritoMorada: ['', Validators.required],
      Id_Usuario: [localStorage.getItem('id'), Validators.required]
    });

    // Id_Pais
    this.nacionalidade = this.config.ListaNacionalidade();
    this.provMorada = this.config.ListaProvincia();
    this.nivelAcademico = this.config.ListaNivelAcademico();
    this.tipoVinculo = this.config.ListaTipoVinculo();
    this.regime = this.config.ListaRegime();
    this.sexo = this.config.ListaSexo();
    this.estadocivil = this.config.EstadoCivil();
    this.situacao = this.config.ListaSituacaoCadastro();

    this.centro = this.config.ListarCentros();

    // console.log(this.cadastro);
    // ========================================================================
    // this.CadastroForm.patchValue(this.cadastro);

    this.atualisarFotografia();

    this.CadastroForm.get('Id_Trabalhador').valueChanges.subscribe(data => {
      this.config.BuscaFoto(data).subscribe(M => {
        // this.CadastroForm.controls.Foto.setValue('Florindo');
        if (M && M[0].Foto) {
          this.imageUrl = 'data:image/jpeg;base64,' + M[0].Foto;
        } else {
          this.imageUrl = '/assets/avatar.png'
        }
      });
    });
    //   this.imageUrl = 'data:image/jpeg;base64,' + this.DadosPessoais[0].Foto;

    // =======================================================================
    this.prov = this.config.ListaProvincia().filter((item) => {
      return item.Id_Pais === Number(this.CadastroForm.controls.Id_Nacionalidade.value);
    });

    this.CadastroForm.get('Id_Nacionalidade').valueChanges.subscribe(data => {
      this.prov = this.config.ListaProvincia().filter((item) => {
        return item.Id_Pais === Number(data);
      });
    });

    // =======================================================================

    this.Mun = this.config.getMunicipio().filter((item) => {
      return item.Id_Provincia === Number(this.CadastroForm.controls.Id_Provincia.value);
    });
    this.CadastroForm.get('Id_Provincia').valueChanges.subscribe(data => {
      this.Mun = this.config.getMunicipio().filter((item) => {
        return item.Id_Provincia === Number(data);
      });
    });

    // =======================================================================

    this.Comun = this.config.getComuna().filter((item) => {
      return item.Id_Municipio === Number(this.CadastroForm.controls.Id_Municipio.value);
    });

    this.CadastroForm.get('Id_Municipio').valueChanges.subscribe(data => {
      console.log('atualizar comuna');
      this.Comun = this.config.getComuna().filter((item) => {
        return item.Id_Municipio === Number(data);
      });
    });
    // =======================================================================

    this.Motivo = this.config.getSituacaoMotivo().filter((item) => {
      return item.Codigo === Number(this.CadastroForm.controls.Situacao.value);
    });

    this.CadastroForm.get('Situacao').valueChanges.subscribe(data => {
      this.Motivo = this.config.getSituacaoMotivo().filter((item) => {
        if (data === 1) {
          this.motivoEstado = true;
          this.CadastroForm.controls.Motivo.setValue(data);
       } else { this.motivoEstado = false; }

     //  console.log
        return item.Codigo === Number(data);
      });
    });
    // =======================================================================

    this.MunMorada = this.config.getMunicipio().filter((item) => {
      return item.Id_Provincia === Number(this.CadastroForm.controls.Id_ProvinciaMorada.value);
    });

    this.CadastroForm.get('Id_ProvinciaMorada').valueChanges.subscribe(data => {
      this.MunMorada = this.config.getMunicipio().filter((item) => {
        return item.Id_Provincia === Number(data);
      });
    });
    // =======================================================================

    this.carreira = this.config.getCarreira().filter((item) => {
      return item.Id_Regime === Number(this.CadastroForm.controls.Id_Regime.value);
    });

    this.CadastroForm.get('Id_Regime').valueChanges.subscribe(data => {
      this.carreira = this.config.getCarreira().filter((item) => {
        return item.Id_Regime === Number(data);
      });
    });

    // =======================================================================

    this.categoria = this.config.getCategoria().filter((item) => {
      return item.Id_Carreira === Number(this.CadastroForm.controls.Id_Carreira.value);
    });

    this.CadastroForm.get('Id_Carreira').valueChanges.subscribe(data => {
      this.categoria = this.config.getCategoria().filter((item) => {
        return item.Id_Carreira === Number(data);
      });
    });

    // =======================================================================

    this.distrito = this.config.getDistrito().filter((item) => {
      return item.Id_Comuna === Number(this.CadastroForm.controls.Id_Comuna.value);
    });

    this.CadastroForm.get('Id_Comuna').valueChanges.subscribe(data => {
      this.distrito = this.config.getDistrito().filter((item) => {
        return item.Id_Comuna === Number(data);
      });
    });

    // =======================================================================

    this.ComuMorada = this.config.getComuna().filter((item) => {
      return item.Id_Municipio === Number(this.CadastroForm.controls.Id_MunicipioMorada.value);
    });

    this.CadastroForm.get('Id_MunicipioMorada').valueChanges.subscribe(data => {
      this.ComuMorada = this.config.getComuna().filter((item) => {
        return item.Id_Municipio === Number(data);
      });
    });

    // =======================================================================

    this.distritoMorada = this.config.getDistrito().filter((item) => {
      return item.Id_Comuna === Number(this.CadastroForm.controls.Id_ComunaMorada.value);
    });

    this.CadastroForm.get('Id_ComunaMorada').valueChanges.subscribe(data => {
      this.distritoMorada = this.config.getDistrito().filter((item) => {
        return item.Id_Comuna === Number(data);
      });
    });

    // =======================================================================

    if (this.service.subsVar === undefined) {
      this.service.subsVar = this.service.
        EmitirEvento.subscribe((res) => {
          this.onRefresh();
        });
    }

    if (this.cameraservico.subsVar === undefined) {
      this.cameraservico.subsVar = this.cameraservico.
        EmitirFotoEvento.subscribe((res) => {
          this.onRefresh();
        });
    }
  }

  // Novos metodos adicionados

  private atualisarFotografia() {
    this.config.BuscaFoto(this.CadastroForm.controls.Id_Trabalhador.value)
      .subscribe(M => {
        //  console.log(M);
        this.imageUrl = 'data:image/jpeg;base64,' + M[0].Foto;
        // this.CadastroForm.controls.Foto.setValue('Florindo');
      });
  }

  private validarFormulario(fieldsToValidate: string[]): boolean {
    var result: boolean = true;
    fieldsToValidate.forEach(element => {
      // console.log('Element', element);
      if (this.CadastroForm.get(element).hasError('required')) {
        console.log('Campo não prienchido', element);
        this.hasError = true;
        this.fieldError = element;
        result = false;
      }
    });
    return result;
  }

  onTabChanged($event) {
    let clickedIndex = $event.index;
    if (!this.CadastroForm.valid) {
      // console.log(this.validarFormulario(FIELDS_FORM_PERSON));
      // console.log(this.validarFormulario(FIELDS_FORM_COMPLEMENTARES));
      if (!this.validarFormulario(FIELDS_FORM_PERSON)) {
        this.selectedTabIndex = 0;
      } else if (!this.validarFormulario(FIELDS_FORM_COMPLEMENTARES)) {
        this.selectedTabIndex = 1;
      } else if (!this.validarFormulario(FIELDS_FORM_VINCULO)) {
        this.selectedTabIndex = 2;
      }
    } else {
      this.selectedTabIndex = clickedIndex;
      this.hasError = false;
    }
  }

  changeTabIncrement(val:number) {
    if(this.selectedTabIndex <= 0 && val < 0){
      this.selectedTabIndex = 2;
    }else if (this.selectedTabIndex >= 2 && val > 0){
      this.selectedTabIndex = 0;
    }else{
      this.selectedTabIndex += val;
    }
  }

  public dismiss() {
    this.cadastroDialogRef.close();
  }

  onRefresh() {
    this.config.BuscaFoto(this.CadastroForm.controls.Id_Trabalhador.value)
      .subscribe(M => {
        //  console.log(M);
        this.imageUrl = 'data:image/jpeg;base64,' + M[0].Foto;
      });
    this.CadastroForm.get('Id_Trabalhador').valueChanges.subscribe(data => {
      this.config.BuscaFoto(data).subscribe(M => {
        //  this.CadastroForm.controls.Foto.setValue('Florindo');
        this.imageUrl = 'data:image/jpeg;base64,' + M[0].Foto;

        this.dataURItoBlob(this.imageUrl).subscribe((blob) => {
          const imageBlob: Blob = blob;
          const imageName = this.CadastroForm.controls.Id_Trabalhador.value + '.jpeg';
          this.vfile = new File([imageBlob], imageName, { type: 'image/jpeg', });
          console.log('imageFile', this.vfile);
          //   this.CadastroForm.controls.Foto.setValue('imageFile', this.vfile);
        });

      });
    });
    // this.ngOnInit();
  }

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

  OnSubmit() {
    //   console.log(this.CadastroForm.value);
    if (this.CadastroForm.valid) {
      this.spinner.show();
      this.service.GravaTrabalhador(this.CadastroForm.value).subscribe(res => {
        // console.log(res);
        this.service.EmitirEvento.emit();
        this.spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Candidato ${this.CadastroForm.value.Trabalhador} adicionado com sucesso`,
          showConfirmButton: false,
          timer: 3500
        });
        this.dismiss();
      }, err => {
        console.log('Erro ao Salvar candidato', err);
        this.spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `Occorreu um erro ao Adicionar o Candidato ${this.CadastroForm.value.Trabalhador}.`,
          showConfirmButton: false,
          timer: 3500
        });
      }
      );

      // Actualiza(formData: FormData) {

      //   return this.http.post(environment.apiURL + '/ActualizarCadastro/', this.CadastroForm.value);
      //  }
    } else {
      // console.log('flo');
      this.validateAllFormFields(this.CadastroForm); // {7}
    }

  }

  validateAllFormFields(formGroup: FormGroup) {
    // {1}
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field); // {3}
      if (control instanceof FormControl) {
        // {4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        // {5}
        this.validateAllFormFields(control); // {6}
      }
    });
  }

  ApagarFoto(): void {
    Swal.fire({
      title: 'Deseja apagar a foto do Funcionário?',
      // text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.ApagaFoto(this.CadastroForm.controls.Id_Trabalhador.value).subscribe(res => {
          this.imageUrl = '/assets/avatar.png';
          this.onRefresh();
        }
          ,
          err => {
            console.log(err);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Erro ao eliminar o Foto!',
              //  footer: '<a href>Why do I have this issue?</a>'
            });
          }
        );
        Swal.fire(
          'Registo !',
          'Foto eliminado.',
          'success'
        );
      }
    });
  }
  FormCamera(trab): void {
    //    console.log(trab);
    this.cameraDialogRef = this._matDialog.open(CameraComponent, {
      width: '600px',
      height: '350px',
      data: {
        trabalhador: this.CadastroForm.controls.Id_Trabalhador.value,
        action: 'edit'
      }
    });


    this.cameraDialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          this.atualisarFotografia();
          return;
        }
      });
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }
  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }
  capture() {
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
  }
  handleError(error) {
    console.log('Error: ', error);
  }
  // tslint:disable-next-line: typedef
  handleFileInput(file: FileList) {
    // console.log(file.item(0));
    this.fileToUpload = file.item(0);
    //  console.log(file.item(0));
    //  this.Foto = file.item(0);
    // this.pessoa.Image =  this.fileToUpload ;

    // Show image preview
    //   if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      //  this.pessoa.Foto = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
    //  }
  }

}
