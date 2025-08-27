import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true,
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class SplashPage implements OnInit {
  expandLogo = false;
  isExiting = false;

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.expandLogo = true;
    }, 1500);

    setTimeout(() => {
      this.triggerExit();
    }, 3000);
  }

  triggerExit() {
    this.isExiting = true;
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 800); // Match fade duration
  }
}
