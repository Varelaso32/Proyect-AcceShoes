import { Component, OnInit } from '@angular/core';
import {
  PrivacyPolicyService,
  PrivacyPolicy,
  CreatePrivacyPolicyDto,
} from '../../../../Shared/services/politica-privacidad.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-politicas-privacidad',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './politicas-privacidad.component.html',
  styleUrl: './politicas-privacidad.component.css',
})
export class PoliticasPrivacidadComponent implements OnInit {
  politicas: PrivacyPolicy[] = [];

  // Estados para modales
  modalAbierto: 'crear' | 'editar' | null = null;

  // Para crear política
  nuevaPolitica: CreatePrivacyPolicyDto = {
    description: '',
  };

  // Para editar política
  politicaEditando: PrivacyPolicy | null = null;
  editData: CreatePrivacyPolicyDto = {
    description: '',
  };

  // Mensajes
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  constructor(private privacyPolicyService: PrivacyPolicyService) {}

  ngOnInit() {
    this.cargarPoliticas();
  }

  cargarPoliticas() {
    this.privacyPolicyService.getPolicies().subscribe({
      next: (policies) => {
        this.politicas = policies;
      },
      error: (err) => {
        this.mostrarError('Error cargando políticas de privacidad');
      },
    });
  }

  abrirModalCrear() {
    this.nuevaPolitica = {
      description: '',
    };
    this.modalAbierto = 'crear';
    this.limpiarMensajes();
  }

  crearPolitica() {
    if (!this.nuevaPolitica.description) {
      this.mostrarError('La descripción es obligatoria');
      return;
    }

    this.isLoading = true;

    this.privacyPolicyService.createPolicy(this.nuevaPolitica).subscribe({
      next: () => {
        this.mostrarExito('Política creada correctamente');
        this.cargarPoliticas();
        this.cerrarModal();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.mostrarError('Error creando política de privacidad');
      },
    });
  }

  abrirModalEditar(policy: PrivacyPolicy) {
    this.politicaEditando = policy;
    this.editData = {
      description: policy.description,
    };
    this.modalAbierto = 'editar';
    this.limpiarMensajes();
  }

  guardarCambios() {
    if (!this.politicaEditando) return;

    if (!this.editData.description) {
      this.mostrarError('La descripción es obligatoria');
      return;
    }

    this.isLoading = true;

    this.privacyPolicyService
      .updatePolicy(this.politicaEditando.id, this.editData)
      .subscribe({
        next: () => {
          this.mostrarExito('Política actualizada correctamente');
          this.cargarPoliticas();
          this.cerrarModal();
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.mostrarError('Error actualizando política de privacidad');
        },
      });
  }

  eliminarPolitica(policy: PrivacyPolicy) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar esta política de privacidad. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06b6d4', // color cian
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.privacyPolicyService.deletePolicy(policy.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: `La política fue eliminada correctamente.`,
              confirmButtonColor: '#06b6d4',
            });
            this.cargarPoliticas();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `No se pudo eliminar la política.`,
              confirmButtonColor: '#06b6d4',
            });
          },
        });
      }
    });
  }

  cerrarModal() {
    this.modalAbierto = null;
    this.politicaEditando = null;
    this.limpiarMensajes();
  }

  mostrarExito(mensaje: string) {
    this.successMessage = mensaje;
    this.errorMessage = null;

    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,
      confirmButtonColor: '#06b6d4',
    });
  }

  mostrarError(mensaje: string) {
    this.errorMessage = mensaje;
    this.successMessage = null;

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonColor: '#d33',
    });
  }

  limpiarMensajes() {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
