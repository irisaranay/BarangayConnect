import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonLabel,
  IonItem, IonList, IonDatetime, IonSelect, IonSelectOption, IonButton,
  IonNote, IonThumbnail, IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonInput, IonLabel, IonItem, IonList, IonDatetime,
    IonSelect, IonSelectOption, IonButton, IonNote,
    IonThumbnail, IonIcon,
    FormsModule, CommonModule, HttpClientModule
  ]
})
export class RegistrationPage {
  // Personal Info
  firstName = '';
  middleName = '';
  lastName = '';
  dob: string = '';
  gender = '';
  civilStatus = '';

  // Contact & Address
  contact = '';
  purok = '';
  barangay = '';
  city = '';
  province = '';
  postalCode = '';

  // Security
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirm = false;
  passwordError = false;
  confirmError = false;

  // Photo
  photo: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmVisibility() {
    this.showConfirm = !this.showConfirm;
  }

  validatePassword() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    this.passwordError = !regex.test(this.password);
  }

  isValidContact(contact: string): boolean {
    const pattern = /^09\d{9}$/;
    return pattern.test(contact);
  }

  async takePhoto() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    const brightness = await this.checkBrightness(image.dataUrl!);
    console.log('📸 Brightness level:', brightness);

    if (brightness < 50) {
      alert('Photo is too dark. Please take a clearer selfie.');
      return;
    }

    this.photo = image.dataUrl ?? null;
  } catch (error) {
    console.error('Camera error:', error);
    alert('Camera not available or permission denied.');
  }
}

checkBrightness(dataUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let totalBrightness = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;
      }

      const avg = totalBrightness / (imageData.data.length / 4);
      resolve(avg);  // 0 = very dark, 255 = very bright
    };
  });
}

  register() {
    this.validatePassword();
    this.confirmError = this.password !== this.confirmPassword;

    if (!this.firstName || !this.lastName || !this.contact || !this.dob || !this.gender || !this.civilStatus) {
      alert('Please fill out all required fields.');
      return;
    }

    if (!this.isValidContact(this.contact)) {
      alert('Invalid contact number. Must start with 09 and be 11 digits.');
      return;
    }

    if (this.passwordError || this.confirmError) {
      alert('Please fix the password errors.');
      return;
    }

    if (!this.photo) {
      alert('Please take a selfie photo.');
      return;
    }

    const formattedContact = this.contact.startsWith('0')
      ? '+63' + this.contact.slice(1)
      : this.contact;

    const payload = {
      phone: formattedContact,
      password: this.password,
      role: 'resident',
      first_name: this.firstName,
      middle_name: this.middleName,
      last_name: this.lastName,
      dob: this.dob,
      gender: this.gender,
      civil_status: this.civilStatus,
      purok: this.purok,
      barangay: this.barangay,
      city: this.city,
      province: this.province,
      postal_code: this.postalCode.toString(), 
      selfie: this.photo
    };

    console.log("📦 Sending payload to backend:", payload);

    this.http.post('http://127.0.0.1:8000/register-full', payload).subscribe({
      next: (res: any) => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
  console.error('❌ Registration error:', err);

  let message = 'Registration failed.';
  if (err.error?.detail) {
    message = typeof err.error.detail === 'string'
      ? err.error.detail
      : JSON.stringify(err.error.detail); // convert object to string
  }

  alert(message);
}
    });
  }
}
