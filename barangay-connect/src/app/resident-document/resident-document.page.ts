import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resident-document',
  templateUrl: './resident-document.page.html',
  styleUrls: ['./resident-document.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ResidentDocumentPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
