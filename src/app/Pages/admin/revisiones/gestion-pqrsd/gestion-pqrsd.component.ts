import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PqrsService } from '../../../../Shared/services/pqrs.service';

@Component({
  selector: 'app-gestion-pqrsd',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-pqrsd.component.html',
  styleUrl: './gestion-pqrsd.component.css',
})
export class GestionPqrsdComponent implements OnInit {
  pqrsList: any[] = [];
  pqrsSeleccionada: any = null;
  isLoading = false;
  error: string | null = null;

  constructor(private pqrsService: PqrsService) {}

  ngOnInit(): void {
    this.getAllPqrs();
  }

  seleccionarPqrs(pqrs: any) {
    this.pqrsSeleccionada = pqrs;
  }

  getAllPqrs(): void {
    this.isLoading = true;
    this.error = null;

    this.pqrsService.getAllPqrs().subscribe({
      next: (data) => {
        this.pqrsList = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al obtener las PQRSD';
        this.isLoading = false;
      },
    });
  }
}
