import { EventEmitter, Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '@app/services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    mostrarMenuEmiter = new EventEmitter<boolean>();
    constructor(private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        // localStorage.removeItem('userToken');
        const token = localStorage.getItem('userToken');
        if (token) {
            this.mostrarMenuEmiter.emit(true);
            return true;
        }
        this.router.navigate(['/account/login']);
        this.mostrarMenuEmiter.emit(false);
        return false;

    }
}