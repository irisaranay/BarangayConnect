import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonModal,
  IonContent,
  IonIcon,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonText,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonModal,
    IonContent,
    IonIcon,
    IonRouterLink,
    HttpClientModule,
  ],
})
export class SignupPage {
  fullName = '';
  dob = '';
  isDobModalOpen = false;
  gender = '';
  civilStatus = '';
  contactNumber = '';
  address = '';
  password = '';
  confirmPassword = '';
  selectedFile: File | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  openDobModal() {
    this.isDobModalOpen = true;
  }

  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const payload = {
      full_name: this.fullName,
      dob: this.dob,
      gender: this.gender,
      civil_status: this.civilStatus,
      phone: this.contactNumber,
      address: this.address,
      password: this.password,
      role: 'resident', // You can change this if needed
    };

    this.http.post('http://127.0.0.1:8000/register', payload).subscribe({
      next: (res) => {
        console.log('✅ Registered:', res);
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
        alert(err.error?.detail || 'Registration failed.');
      },
    });
  }
}
