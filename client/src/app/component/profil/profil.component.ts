import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  user: any = null;
  showError = false;
  errorMessage = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.getProfile().subscribe({
      next: (data) => this.user = data,
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to load profile.';
      }
    });
  }
}
