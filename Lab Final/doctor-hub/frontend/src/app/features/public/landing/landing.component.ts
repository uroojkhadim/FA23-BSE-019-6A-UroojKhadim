import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, PublicNavbarComponent],
  template: `
    <app-public-navbar />
    <section class="hero fade-in">
      <div class="hero-content">
        <h1>Healthcare Consultation,<br /><span>Simplified</span></h1>
        <p>Find Allopathic, Homeopathic & Herbal doctors. Book appointments, track medical history, and manage prescriptions securely.</p>
        <div class="actions">
          <a mat-flat-button color="primary" routerLink="/doctors">Find a Doctor</a>
          <a mat-stroked-button color="primary" routerLink="/register">Get Started</a>
        </div>
      </div>
      <div class="hero-visual">
        <mat-icon class="hero-icon">medical_services</mat-icon>
      </div>
    </section>
    <section class="features page-container">
      <div class="feature card-panel">
        <mat-icon>search</mat-icon>
        <h3>Smart Doctor Search</h3>
        <p>Filter by disease, treatment type, specialization, city, and ratings.</p>
      </div>
      <div class="feature card-panel">
        <mat-icon>event_available</mat-icon>
        <h3>Easy Booking</h3>
        <p>Book appointments with verified payment workflow.</p>
      </div>
      <div class="feature card-panel">
        <mat-icon>history_edu</mat-icon>
        <h3>Immutable Records</h3>
        <p>Secure, audit-friendly medical history and prescriptions.</p>
      </div>
    </section>
  `,
  styles: `
    .hero {
      display: flex; align-items: center; justify-content: space-between;
      padding: 80px 48px; max-width: 1200px; margin: 0 auto; gap: 48px;
      min-height: 70vh;
    }
    h1 { font-size: 3rem; line-height: 1.2; margin: 0 0 16px; color: var(--dh-text); }
    h1 span { color: var(--dh-primary); }
    p { font-size: 1.15rem; color: var(--dh-muted); max-width: 520px; }
    .actions { display: flex; gap: 16px; margin-top: 32px; }
    .hero-visual {
      background: linear-gradient(135deg, #e3f2fd, #e8f5e9);
      border-radius: 24px; padding: 60px; flex-shrink: 0;
    }
    .hero-icon { font-size: 120px; width: 120px; height: 120px; color: var(--dh-primary); }
    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; padding-bottom: 80px; }
    .feature mat-icon { font-size: 40px; width: 40px; height: 40px; color: var(--dh-accent); }
    .feature h3 { margin: 12px 0 8px; }
    .feature p { color: var(--dh-muted); margin: 0; }
    @media (max-width: 768px) {
      .hero { flex-direction: column; padding: 40px 24px; text-align: center; }
      h1 { font-size: 2rem; }
      .actions { justify-content: center; }
    }
  `,
})
export class LandingComponent {}
