import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.accountService.userValue;
        const isLoggedIn = user && user.access_token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        // console.log('Itercept ative', user);
        // console.log('URL', isApiUrl);
        // console.log('isLoged in', isLoggedIn);
        
        if (isLoggedIn && isApiUrl) {
            // console.log('Itercept ative 2 URL', isApiUrl);
            request = request.clone({
                setHeaders: {
                    Authorization: `${user.token_type} ${user.access_token}`
                }
            });
        }

        return next.handle(request);
    }
}