import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Bharat Airlines';

  constructor(public authService: AuthService, private router: Router) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get role(): string | null {
    return this.authService.getRole;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    window.location.reload();
  }

  // ── Bharat Airlines UI methods ──

  activateTab(event: Event): void {
    const el = event.currentTarget as HTMLElement;
    el.closest('.search-tabs')?.querySelectorAll('.search-tab')
      .forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }

  setMainTab(event: Event): void {
    document.querySelectorAll('.main-tab')
      .forEach(t => t.classList.remove('active'));
    (event.currentTarget as HTMLElement).classList.add('active');
  }

  swapCities(): void {
    const f = document.getElementById('fromCity');
    const t = document.getElementById('toCity');
    if (f && t) {
      const tmp = f.textContent ?? '';
      f.textContent = t.textContent ?? '';
      t.textContent = tmp;
    }
  }

  setDest(city: string): void {
    const el = document.getElementById('toCity');
    if (el) el.textContent = city.toUpperCase().substring(0, 3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  readonly sampleFlights = [
    { num: 'BA-204', name: 'Bharat Express', dep: '06:00', arr: '08:20', dur: '2h 20m', price: '₹3,499', cls: 'Economy' },
    { num: 'BA-218', name: 'Yamuna Arrow',   dep: '09:30', arr: '11:50', dur: '2h 20m', price: '₹3,799', cls: 'Economy' },
    { num: 'BA-332', name: 'Deccan Pride',   dep: '12:15', arr: '14:35', dur: '2h 20m', price: '₹4,299', cls: 'Business' },
    { num: 'BA-445', name: 'Mumbai Express', dep: '15:00', arr: '17:25', dur: '2h 25m', price: '₹3,649', cls: 'Economy' },
    { num: 'BA-560', name: 'Gateway Flyer',  dep: '18:30', arr: '20:55', dur: '2h 25m', price: '₹3,299', cls: 'Economy' },
    { num: 'BA-891', name: 'Ganga Vihar',    dep: '21:00', arr: '23:20', dur: '2h 20m', price: '₹8,999', cls: 'Business' },
  ];

  searchFlights(): void {
    const from = document.getElementById('fromCity')?.textContent ?? '';
    const to   = document.getElementById('toCity')?.textContent ?? '';
    const date = (document.getElementById('depDate') as HTMLInputElement)?.value ?? '';
    const panel = document.getElementById('resultsPanel');
    const list  = document.getElementById('flightList');
    const routeEl = document.getElementById('resultsRoute');
    const metaEl  = document.getElementById('resultsMeta');
    const countEl = document.getElementById('resultsCount');

    if (routeEl) routeEl.textContent = `${from} → ${to}`;
    if (metaEl)  metaEl.textContent  = `${date} · 1 Passenger · Economy`;
    if (countEl) countEl.textContent = `${this.sampleFlights.length} flights found`;

    if (list) {
      list.innerHTML = this.sampleFlights.map(f => `
        <div class="flight-item">
          <div class="flight-num-badge">${f.num}</div>
          <div>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">${f.name}</div>
            <div style="display:flex;align-items:center;gap:20px">
              <div><div class="flight-time">${f.dep}</div><div class="flight-code">${from}</div></div>
              <div class="flight-duration" style="flex:1;text-align:center">
                <div style="font-size:16px">——✈——</div><div>${f.dur}</div>
              </div>
              <div style="text-align:right"><div class="flight-time">${f.arr}</div><div class="flight-code">${to}</div></div>
            </div>
          </div>
          <div class="flight-price-col">
            <div class="flight-price-amount">${f.price}</div>
            <div class="flight-price-type">${f.cls} · per person</div>
          </div>
          <button class="flight-select-btn" onclick="alert('Redirecting to seat selection for ${f.num}...')">Select</button>
        </div>
      `).join('');
    }

    panel?.classList.add('visible');
    document.getElementById('resultsSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showView(view: string, event?: Event): void {
    if (event) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      (event.currentTarget as HTMLElement).classList.add('active');
    }
    if (view === 'home') {
      document.getElementById('homeView')?.classList.remove('hidden');
      document.getElementById('dashView')?.classList.remove('active');
      const tabs = document.getElementById('mainTabs');
      if (tabs) tabs.style.display = 'flex';
    } else {
      document.getElementById('homeView')?.classList.add('hidden');
      document.getElementById('dashView')?.classList.add('active');
      const tabs = document.getElementById('mainTabs');
      if (tabs) tabs.style.display = 'none';
    }
  }

  openModal(id: string): void {
    document.getElementById(id)?.classList.add('open');
  }

  closeModal(id: string): void {
    document.getElementById(id)?.classList.remove('open');
  }

  closeModalOutside(event: Event, id: string): void {
    if ((event.target as HTMLElement).id === id) this.closeModal(id);
  }

  doLogin(): void {
    this.closeModal('loginModal');
    this.showView('dashboard');
    document.querySelector('.nav-links a.active')?.classList.remove('active');
  }
}

