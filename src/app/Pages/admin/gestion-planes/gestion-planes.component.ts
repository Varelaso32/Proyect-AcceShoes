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
    // implementación futura
  }

  eliminarPlan(plan: Plan) {
    // implementación futura
  }
}
