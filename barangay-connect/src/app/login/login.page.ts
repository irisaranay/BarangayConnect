  import { Component } from '@angular/core';
  import { RouterModule, Router } from '@angular/router';
  import { FormsModule } from '@angular/forms';
  import { IonicModule } from '@ionic/angular';
  import { CommonModule } from '@angular/common';
  import { HttpClient, HttpClientModule } from '@angular/common/http';
  import { LoadingController } from '@ionic/angular';


  @Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [IonicModule, FormsModule, CommonModule, HttpClientModule, RouterModule],
  })
  export class LoginPage {
    phone = '';
    password = '';
    showPassword = false;
    activeInput: string = '';

    constructor(private router: Router, private http: HttpClient, private loadingCtrl: LoadingController) {}

    async login() {
      if (!this.phone.trim() || !this.password.trim()) {
      alert('Please enter phone and password.');
      return;
    }
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
      spinner: 'crescent'
    });
    await loading.present();

    const payload = {
      phone: this.phone,
      password: this.password,
    };

    this.http.post<any>('http://127.0.0.1:8000/login', payload).subscribe({
      next: async (response) => {
        await loading.dismiss();
        localStorage.setItem('role', response.role);
        localStorage.setItem('user_id', response.user_id);

        if (response.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (response.role === 'resident') {
          this.router.navigate(['/resident-dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: async (err) => {
        await loading.dismiss();
        alert(err.error?.detail || 'Login failed.');
      },
    });
  }

    forgotPassword() {
      alert('Redirect to forgot password page.');
    }

    setActive(input: string) {
      this.activeInput = input;
    }

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
  }
