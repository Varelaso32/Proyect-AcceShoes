import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../Shared/components/footer/footer.component';
import { NavbarComponent } from '../../Shared/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterModule,
    GoogleMapsModule,
  ],
  templateUrl: './ubicacion.component.html',
  styleUrl: './ubicacion.component.css',
})
export class UbicacionComponent {
  view: 'listado' | 'mapa' = 'listado';
  gpsUbicacion: { lat: number; lng: number } | null = null;

  tiendas = [
    { ciudad: 'Cali', direccion: 'Av.Centenario Nº 3-180  C.C. Calima' },
    { ciudad: 'Palmira', direccion: 'Carrera 29b #49-32, La selva, Local 120' },
    { ciudad: 'Buenaventura', direccion: 'Ciudad del sur, calle 14c #32-74' },
    { ciudad: 'Armenia', direccion: 'Av.Centenario Nº 5-50  C.C. MallPlaza' },
    { ciudad: 'Jamundí', direccion: 'Av.SUR Nº 304-1, Local 120B' },
    { ciudad: 'Yumbo', direccion: 'Av.Norte Nº 302-18  CC SURI' },
  ];

  // Coordenadas de Cl 9B #29a67, La Alameda, Cali
  center = { lat: 3.4214, lng: -76.5297 };

  usarGPS() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.center = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          this.gpsUbicacion = { ...this.center };
          this.view = 'mapa';
        },
        () => {
          alert('No se pudo acceder a la ubicación');
        }
      );
    } else {
      alert('Geolocalización no soportada');
    }
  }
}
