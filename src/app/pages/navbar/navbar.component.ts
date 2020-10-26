import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  logout(): void {
    
    localStorage.removeItem('userToken');
    // this.userService.isLoggesIn(false);
  //  localStorage.setItem('loginStatus', '0');
  //  localStorage.setItem('idEmpresa', '0');
  localStorage.removeItem('loginStatus');
  localStorage.removeItem('idEmpresa');
    localStorage.removeItem('user');
    localStorage.removeItem('NomeEmpresa');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    this.router.navigate(['/login']);

  }

}
