import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VersionService } from '../../services/version.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  appName = '';
  appVersion = '';

  constructor(private versionService: VersionService) {}

  ngOnInit(): void {
    this.versionService.getVersion().subscribe((data) => {
      this.appName = data.name;
      this.appVersion = data.version;
    });
  }
}
