import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AdminLoginPage {
  phone = '';
  password = '';
  role = ''; // will be updated by backend response
  showPassword = false;
  activeInput = '';
  admin_type = ''; // new line

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  setActive(input: string) {
    this.activeInput = input;
  }

  forgotPassword() {
    alert('Redirect to forgot password page.');
  }

  login() {
  if (!this.phone || !this.password || !this.admin_type) {
    alert('Please enter phone, password, and select a role (captain or secretary).');
    return;
  }

  fetch('http://localhost:8000/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: this.phone,
      password: this.password,
      admin_type: this.admin_type  // send admin_type to backend
    }),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.detail) });
      }
      return response.json();
    })
    .then(data => {
      console.log('Role:', data.role);
      console.log('Admin Type:', data.admin_type);
      // Store to local storage (optional)
      localStorage.setItem('user_role', data.role);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('admin_type', data.admin_type);

      // Redirect based on admin type
      if (data.role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else if (data.role === 'resident') {
        this.router.navigate(['/resident-dashboard']);
      } else {
        alert('Unauthorized role.');
      }
    })
    .catch(error => {
      alert(error.message || 'Login failed. Please try again.');
    });
}

  getWelcomeMessage() {
    return 'Welcome Admin!';
  }

  getWelcomeDescription() {
    return 'Connect with your barangay easily. Track requests, updates, and community events all in one place.';
  }
}


