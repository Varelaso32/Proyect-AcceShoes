import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes-user.component.html',
  styleUrl: './reportes-user.component.css',
})
export class ReportesUserComponent {
  cargando = false;

  filtro: 'todos' | 'aprobados' | 'rechazados' = 'todos';

  reportes = [
    {
      id: 1,
      imagen: '../../../../../assets/zapatos.jpg',
      motivo: 'Producto dañado',
      descripcion: 'Los zapatos llegaron rotos y usados.',
      visible: false,
      estado: 'pendiente',
    },
    {
      id: 2,
      imagen: '../../../../../assets/zapatos.jpg',
      motivo: 'Producto falsificado',
      descripcion: 'No es original, vendieron como Nike y es imitación.',
      visible: false,
      estado: 'pendiente',
    },
    {
      id: 3,
      imagen: '../../../../../assets/zapatos.jpg',
      motivo: 'Accesorio no coincide',
      descripcion: 'La gorra recibida no es la misma que en la foto.',
      visible: false,
      estado: 'pendiente',
    },
    {
      id: 4,
      imagen: '../../../../../assets/zapatos.jpg',
      motivo: 'Descripción engañosa',
      descripcion: 'La talla no es la correcta, decía M y parece XS.',
      visible: false,
      estado: 'pendiente',
    },
    {
      id: 5,
      imagen: '../../../../../assets/zapatos.jpg',
      motivo: 'Producto manchado',
      descripcion: 'La camiseta llegó con manchas de fábrica.',
      visible: false,
      estado: 'pendiente',
    },
  ];

  // Getter que devuelve los reportes filtrados según estado
  get reportesFiltrados() {
    if (this.filtro === 'aprobados') {
      return this.reportes.filter((r) => r.estado === 'aprobado');
    } else if (this.filtro === 'rechazados') {
      return this.reportes.filter((r) => r.estado === 'rechazado');
    }
    return this.reportes; // todos
  }

  // Contadores para mostrar en botones
  get countAprobados() {
    return this.reportes.filter((r) => r.estado === 'aprobado').length;
  }

  get countRechazados() {
    return this.reportes.filter((r) => r.estado === 'rechazado').length;
  }

  get countPendientes() {
    return this.reportes.filter((r) => r.estado === 'pendiente').length;
  }

  toggleVerMas(reporte: any) {
    reporte.visible = !reporte.visible;
  }

  aceptarReporte(reporte: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás aceptando este reporte.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#06b6d4',
    }).then((result) => {
      if (result.isConfirmed) {
        this.simularCarga(() => {
          reporte.estado = 'aprobado';
          Swal.fire('¡Hecho!', 'Reporte aceptado', 'success');
        });
      }
    });
  }

  rechazarReporte(reporte: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás rechazando este reporte.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    }).then((result) => {
      if (result.isConfirmed) {
        this.simularCarga(() => {
          reporte.estado = 'rechazado';
          Swal.fire('¡Hecho!', 'Reporte rechazado', 'success');
        });
      }
    });
  }

  simularCarga(callback: () => void) {
    this.cargando = true;
    setTimeout(() => {
      this.cargando = false;
      callback();
    }, 2000);
  }

  // Cambiar filtro
  setFiltro(nuevoFiltro: 'todos' | 'aprobados' | 'rechazados') {
    this.filtro = nuevoFiltro;
  }
}
