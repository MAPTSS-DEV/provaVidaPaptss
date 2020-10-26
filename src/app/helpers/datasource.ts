import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { GeraisService } from '@app/services';

export class FilesDataSource extends DataSource<any>
  {

      constructor(
          // tslint:disable-next-line: variable-name
          private _trabalhadorService: GeraisService
      )
      {
          super();
      }

      connect(): Observable<any[]>
      {
          return this._trabalhadorService.ontrabalhadorChanged;
      }

      /**
       * Disconnect
       */
      disconnect(): void
      {
      }


  }