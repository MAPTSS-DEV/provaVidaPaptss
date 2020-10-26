import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { AccountService } from '@app/services';
import { filter } from 'rxjs/operators';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent {
    
    extend = '';

    constructor(private route: ActivatedRoute, public router: Router) {
        this.route.url.subscribe(() => {
          console.log('Active route',route.snapshot.firstChild.data);
         });

         this.router.events.pipe(
             filter(evt => evt instanceof NavigationEnd)
             ).subscribe((event) => {
            console.log(event['url']);
            console.log(this.route.firstChild.routeConfig.path);
            if(this.route.firstChild.routeConfig.path == 'book-genre/:id' || this.route.firstChild.routeConfig.path == 'book-edit/:id'){
                this.extend = 'height: 70em;'
            }else if ( this.route.firstChild.routeConfig.path ==  'book-add'){
                this.extend = 'height: 80em;'
            }else{
                this.extend = ''
            }
        });
      }
}