import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        if (request.headers.get('No-Auth') === 'True') {
            return next.handle(request.clone());
        }

        if (localStorage.getItem('userToken') != null) {
      //    console.log(localStorage.getItem('userToken'));
          const clonedreq = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('userToken'))
            });
          return next.handle(clonedreq)
                .do(
                succ => { },
                err => {
                    if (err.status === 401) {
                        this.router.navigateByUrl('/account/login');
                    }
                }
                );
        } else {
            this.router.navigateByUrl('/account/login');
        }
    }
}