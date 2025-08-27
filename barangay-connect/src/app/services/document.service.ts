import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://127.0.0.1:8000/document-request';

  constructor(private http: HttpClient) {}

  // Submit request (offline-capable)
  submitRequest(payload: any): Observable<any> {
    if (navigator.onLine) {
      return this.http.post(this.apiUrl, payload);
    } else {
      const offlineRequests = JSON.parse(localStorage.getItem('offlineRequests') || '[]');
      offlineRequests.push(payload);
      localStorage.setItem('offlineRequests', JSON.stringify(offlineRequests));
      return of({ message: 'Request saved offline' });
    }
  }

  // Sync all offline requests
  syncOfflineRequests(): Observable<any> {
    const offlineRequests = JSON.parse(localStorage.getItem('offlineRequests') || '[]');
    if (!offlineRequests.length) return of({ message: 'No offline requests to sync' });

    const requests = offlineRequests.map((r: any) => this.http.post(this.apiUrl, r));

    localStorage.removeItem('offlineRequests');

    return new Observable(observer => {
      let completed = 0;
      let hasError = false;

      requests.forEach((req: Observable<any>) => {
  req.subscribe({
    next: () => {
      completed++;
      if (completed === requests.length && !hasError) {
        observer.next({ message: 'All offline requests synced' });
        observer.complete();
      }
    },
    error: (err) => {
      hasError = true;
      observer.error(err);
    }
  });
});
    });
  }
}
