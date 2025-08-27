import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ ADD THIS LINE
import { AlertController } from '@ionic/angular';
import {
  IonApp,
  IonMenu,
  IonMenuButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButtons,
  IonButton,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonChip,
  IonLabel,
  IonList,
  IonItem,
  IonRouterOutlet,
  IonSearchbar,
  IonBadge
} from '@ionic/angular/standalone';



@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonApp,
    IonMenu,
    IonMenuButton,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButtons,
    IonButton,
    IonAvatar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonChip,
    IonLabel,
    IonList,
    IonItem,
    IonRouterOutlet,
    IonSearchbar,
    IonBadge
  ]
})

export class AdminDashboardPage implements OnInit {
  role: string = '';
  isCaptain: boolean = false;
  currentDate: string = '';
  currentTime: string = '';

  constructor(
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
  const storedRole = localStorage.getItem('user_role');
  const storedAdminType = localStorage.getItem('admin_type'); // ✅ Add this

  if (!storedRole || !storedAdminType) {
    await this.showAccessDenied();
    return;
  }

  this.role = storedRole.toLowerCase();
  const adminType = storedAdminType.toLowerCase(); // ✅

  this.isCaptain = adminType === 'captain'; // ✅ Optional, kung gamiton nimo sa UI

  if (this.role !== 'admin' || (adminType !== 'captain' && adminType !== 'secretary')) {
    await this.showAccessDenied();
  }

  // ✅ Start real-time clock here
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }

  updateDateTime() {
  const now = new Date();

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  this.currentDate = now.toLocaleDateString('en-US', dateOptions);
  this.currentTime = now.toLocaleTimeString('en-US', timeOptions);
}


  async showAccessDenied() {
    const alert = await this.alertCtrl.create({
      header: 'Access Denied',
      message: 'You are not authorized to access the Admin Dashboard.',
      buttons: ['OK']
    });
    await alert.present();
    this.router.navigate(['/admin-login']);
  }

  logout() {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    this.router.navigate(['/admin-login']);
  }

  goToAdminRegistration() {
  this.router.navigate(['/admin-registration']);
}

goToUserRequests() {
  this.router.navigate(['/user-request']);
}
}