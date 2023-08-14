import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from './auth.service';
import {SocialAuthService} from "@abacritt/angularx-social-login";


export const authGuard:

  CanActivateFn = (route: ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const authService = inject(AuthService); // lo inietto dall'esterno
  const router = inject(Router); // lo inietto dall'esterno
  //const authServiceSocial: SocialAuthService = inject(SocialAuthService) // aggiunto dopo per il login n


  if(authService.isLoggedIn){
    return true
  }else{
    // Se l'utente non ha fatto login e ha cercato di visualizzare la dashboard
    // andando su una qualsiasi sezione su http://localhost:4200/dashboard/..., allora
    // lo riporto alla pagina di login.
    router.navigate(['/login'])
    return false
  }

};


