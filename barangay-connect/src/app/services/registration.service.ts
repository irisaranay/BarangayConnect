import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private onlineUrl = 'http://127.0.0.1:8000/register-full';
  private offlineUrl = 'http://127.0.0.1:8001/register-offline';

  // ✅ Add this property
  private currentUser: any = null;

  constructor(private http: HttpClient) {}

   registerUser(payload: any): Observable<any> {
    if (navigator.onLine) {
      // online → PostgreSQL API
      return this.http.post(this.onlineUrl, payload);
    } else {
      // offline → SQLite API
      return this.http.post(this.offlineUrl, payload);
    }
  }
  // ✅ NEW METHODS for current user
  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  getCurrentUser(): Promise<any> {
    return Promise.resolve(this.currentUser);
  }
}