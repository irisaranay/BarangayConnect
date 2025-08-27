import { Component, OnInit } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resident-dashboard',
  templateUrl: './resident-dashboard.page.html',
  styleUrls: ['./resident-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule, FormsModule],
})
export class ResidentDashboardPage implements OnInit {
  user: any = null;
  offlineUsers: any[] = [];

  constructor(private http: HttpClient, private loadingCtrl: LoadingController, private router: Router) {}

  ngOnInit() {
    this.loadUser();
    this.loadOfflineUsers();

    // Auto-sync when online
    window.addEventListener('online', () => this.syncOffline());
  }

  loadUser() {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      this.router.navigate(['/login']);
      return;
    }

    // Fetch user info from server
    this.http.get<any>(`http://127.0.0.1:8000/user/${user_id}`).subscribe({
      next: (res) => this.user = res,
      error: (err) => console.error('Failed to fetch user info', err)
    });
  }

  loadOfflineUsers() {
    const saved = localStorage.getItem('offlineUsers');
    this.offlineUsers = saved ? JSON.parse(saved) : [];
  }

  async syncOffline() {
    if (!this.offlineUsers.length) return;

    const loading = await this.loadingCtrl.create({
      message: 'Syncing offline users...',
      spinner: 'crescent'
    });
    await loading.present();

    // Post each offline user to server
    const requests = this.offlineUsers.map(u => this.http.post('http://127.0.0.1:8000/register-full', u));
    
    let completed = 0;
    let hasError = false;

    requests.forEach(req => {
      req.subscribe({
        next: () => {
          completed++;
          if (completed === requests.length && !hasError) {
            loading.dismiss();
            alert('Offline users synced successfully!');
            localStorage.removeItem('offlineUsers');
            this.offlineUsers = [];
          }
        },
        error: (err) => {
          hasError = true;
          loading.dismiss();
          console.error('Sync failed', err);
          alert('Failed to sync offline users.');
        }
      });
    });
  }
}
