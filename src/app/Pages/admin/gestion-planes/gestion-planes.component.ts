import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlansService } from '../../../Shared/services/plans.service';
import { Plan, CreatePlanDto } from '../../../models/plan.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-planes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-planes.component.html',
  styleUrls: ['./gestion-planes.component.css'],
})
export class GestionPlanesComponent implements OnInit {
  planes: Plan[] = [];
  planEditando: Plan | null = null;

  nuevoPlan: CreatePlanDto = {
    name: '',
    description: '',
    price: 0,
    maxActivePosts: null,
    promotionsIncluded: 0,
  };
  modalAbierto: 'crear' | 'editar' | null = null;
  isLoading = false;

  constructor(private plansService: PlansService) {}

  ngOnInit(): void {
    this.cargarPlanes();
  }

  cargarPlanes() {
    this.plansService.getPlans().subscribe((data) => (this.planes = data));
  }

  abrirModalCrear() {
    this.modalAbierto = 'crear';
    this.nuevoPlan = {
      name: '',
      description: '',
      price: 0,
      maxActivePosts: null,
      promotionsIncluded: 0,
    };
  }

  cerrarModal() {
    this.modalAbierto = null;
  }

  crearPlan() {
    this.isLoading = true;
    this.plansService.createPlan(this.nuevoPlan).subscribe({
      next: (plan) => {
        this.planes.push(plan);
        this.mostrarExito('Plan creado correctamente');
        this.cerrarModal();
        this.isLoading = false;
      },
      error: (err) => {
        this.mostrarError('Error al crear el plan');
        this.isLoading = false;
      },
    });
  }

  mostrarExito(mensaje: string) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,
      confirmButtonColor: '#06b6d4',
    });
  }

  mostrarError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonColor: '#d33',
    });
  }

  abrirModalEditar(plan: Plan) {
    this.planEditando = plan;
    this.nuevoPlan = {
      name: plan.name,
      description: plan.description,
      price: plan.price,
      maxActivePosts: plan.maxActivePosts,
      promotionsIncluded: plan.promotionsIncluded,
    };
    this.modalAbierto = 'editar';
  }

  guardarCambiosPlan() {
    if (!this.planEditando) return;

    this.isLoading = true;

    this.plansService
      .updatePlan(this.planEditando.id, this.nuevoPlan)
      .subscribe({
        next: (updatedPlan) => {
          const index = this.planes.findIndex((p) => p.id === updatedPlan.id);
          if (index !== -1) {
            this.planes[index] = updatedPlan;
          }
          this.mostrarExito('Plan actualizado correctamente');
          this.cerrarModal();
          this.isLoading = false;
        },
        error: () => {
          this.mostrarError('Error al actualizar el plan');
          this.isLoading = false;
        },
      });
  }
  
  eliminarPlan(plan: Plan) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el plan "${plan.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.plansService.deletePlan(plan.id).subscribe({
          next: () => {
            this.planes = this.planes.filter((p) => p.id !== plan.id);
            this.mostrarExito('Plan eliminado correctamente');
          },
          error: () => {
            this.mostrarError('Error al eliminar el plan');
          },
        });
      }
    });
  }
}
