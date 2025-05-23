import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../Shared/services/user.service';
import { PlansService } from '../../../../Shared/services/plans.service';
import { Plan } from '../../../../models/plan.model';
import { UserResponse } from '../../../../models/user.model';
@Component({
  selector: 'app-perfil-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-admin.component.html',
  styleUrl: './perfil-admin.component.css',
})
export class PerfilAdminComponent implements OnInit {
  userData: UserResponse | null = null;
  planData: Plan | null = null;
  isLoading = true;
  error: string | null = null;
  selectedTab: 'about' | 'activity' | 'settings' = 'about';

  stats = [
    { label: 'Visitas', value: 2365 },
    { label: 'Likes', value: 1203 },
    { label: 'Comentarios', value: 324 },
    { label: 'Vistas Perfil', value: 1980 },
    { label: 'Visitas web', value: 251 },
    { label: 'Adjuntos', value: 52 },
  ];

  constructor(
    private userService: UserService,
    private plansService: PlansService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.userData = data;
        this.loadPlan(data.plan_id);
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.error = 'No se pudo cargar la información del perfil';
        this.isLoading = false;
      },
    });
  }

  loadPlan(planId: number) {
    this.plansService.getPlans().subscribe({
      next: (plans) => {
        this.planData = plans.find((p) => p.id === planId) || null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar plan:', err);
        this.error = 'No se pudo cargar la información del plan';
        this.isLoading = false;
      },
    });
  }

  onEditProfile() {
    console.log('Editar perfil clicked');
    // Aquí puedes abrir modal o navegar a edición perfil
  }

  onSendMessage() {
    console.log('Enviar mensaje clicked');
    // Aquí puedes abrir chat o modal para enviar mensaje
  }
}
