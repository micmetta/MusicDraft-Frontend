import { Component } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private authService: AuthService, private router: Router) {}

  onLogout(){
    this.authService.logout();
    this.router.navigate([""]) // infine riporto l'utente che ha appena fatto il logout alla HOMEPAGE dell'applicazione.
  }
}
