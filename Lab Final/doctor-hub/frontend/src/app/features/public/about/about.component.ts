import { Component } from '@angular/core';
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [PublicNavbarComponent],
  template: `
    <app-public-navbar />
    <div class="page-container fade-in">
      <h1 class="page-title">About Doctor Hub</h1>
      <div class="card-panel">
        <p>Doctor Hub is a healthcare consultation and patient history management platform supporting Allopathic, Homeopathic, and Herbal treatment pathways.</p>
        <p>Our mission is to connect patients with the right doctors while maintaining secure, immutable medical records.</p>
      </div>
    </div>
  `,
})
export class AboutComponent {}
