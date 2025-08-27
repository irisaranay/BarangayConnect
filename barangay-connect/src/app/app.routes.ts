import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then(m => m.SplashPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.page').then(m => m.SignupPage),
  },
  {
    path: 'resident-dashboard',
    loadComponent: () => import('./resident-dashboard/resident-dashboard.page').then( m => m.ResidentDashboardPage)
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.page').then( m => m.AdminDashboardPage)
  },
  {
    path: 'registration',
    loadComponent: () => import('./registration/registration.page').then( m => m.RegistrationPage)
  },
  {
    path: 'admin-login',
    loadComponent: () => import('./admin-login/admin-login.page').then( m => m.AdminLoginPage)
  },
  {
    path: 'admin-registration',
    loadComponent: () => import('./admin-registration/admin-registration.page').then( m => m.AdminRegistrationPage)
  },
  {
    path: 'user-request',
    loadComponent: () => import('./user-request/user-request.page').then( m => m.UserRequestPage)
  },
  {
    path: 'resident-document',
    loadComponent: () => import('./resident-document/resident-document.page').then( m => m.ResidentDocumentPage)
  },
  
];
