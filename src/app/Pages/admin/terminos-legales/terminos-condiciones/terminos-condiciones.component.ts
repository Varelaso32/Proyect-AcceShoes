import { Component, OnInit } from '@angular/core';
import {
  TermCondition,
  CreateTermConditionDto,
  TermConditionService,
} from '../../../../Shared/services/terminos-condiciones.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.css'],
})
export class TerminosCondicionesComponent implements OnInit {
  terminos: TermCondition[] = [];

  modalAbierto: 'crear' | 'editar' | null = null;

  nuevaTermino: CreateTermConditionDto = {
    description: '',
  };

  terminoEditando: TermCondition | null = null;
  editData: CreateTermConditionDto = {
    description: '',
  };

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  constructor(private terminosService: TermConditionService) {}

  ngOnInit() {
    this.cargarTerminos();
  }

  cargarTerminos() {
    this.terminosService.getTerms().subscribe({
      next: (data) => {
        this.terminos = data;
      },
      error: () => {
        this.mostrarError('Error cargando términos y condiciones');
      },
    });
  }

  abrirModalCrear() {
    this.nuevaTermino = { description: '' };
    this.modalAbierto = 'crear';
    this.limpiarMensajes();
  }

  crearTermino() {
    if (!this.nuevaTermino.description) {
      this.mostrarError('La descripción es obligatoria');
      return;
    }

    this.isLoading = true;

    this.terminosService.createTerm(this.nuevaTermino).subscribe({
      next: () => {
        this.mostrarExito('Término creado correctamente');
        this.cargarTerminos();
        this.cerrarModal();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.mostrarError('Error creando término o condición');
      },
    });
  }

  abrirModalEditar(termino: TermCondition) {
    this.terminoEditando = termino;
    this.editData = { description: termino.description };
    this.modalAbierto = 'editar';
    this.limpiarMensajes();
  }

  guardarCambios() {
    if (!this.terminoEditando) return;

    if (!this.editData.description) {
      this.mostrarError('La descripción es obligatoria');
      return;
    }

    this.isLoading = true;

    this.terminosService
      .updateTerm(this.terminoEditando.id, this.editData)
      .subscribe({
        next: () => {
          this.mostrarExito('Término actualizado correctamente');
          this.cargarTerminos();
          this.cerrarModal();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.mostrarError('Error actualizando término o condición');
        },
      });
  }

  eliminarTermino(termino: TermCondition) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar este término o condición. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06b6d4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.terminosService.deleteTerm(termino.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: `El término fue eliminado correctamente.`,
              confirmButtonColor: '#06b6d4',
            });
            this.cargarTerminos();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `No se pudo eliminar el término.`,
              confirmButtonColor: '#06b6d4',
            });
          },
        });
      }
    });
  }

  cerrarModal() {
    this.modalAbierto = null;
    this.terminoEditando = null;
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
