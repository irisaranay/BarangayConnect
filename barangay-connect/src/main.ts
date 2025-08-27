import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideAuth0 } from '@auth0/auth0-angular';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideAuth0({
      domain: 'dev-xe1g8fri8dyprtsz.us.auth0.com',
      clientId: 'hsAPQtqfCsGwhukf2WeuTgC4m1DYFJL7',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://barangayconnect/api', // ✅ Optional for RBAC
      }
    }),
  ],
});
