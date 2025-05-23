import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Category, CreateCategoryDto } from '../../../models/category.model';
import { CategoryService } from '../../../Shared/services/categories.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-categorias.component.html',
  styleUrl: './gestion-categorias.component.css',
})
export class GestionCategoriasComponent implements OnInit {
  categorias: Category[] = [];
  categoriasPrincipales: Category[] = [];
  categoriaMap = new Map<number, string>();

  // Estados para modales
  modalAbierto: 'crear' | 'editar' | null = null;

  // Para crear categoría
  nuevaCategoria: CreateCategoryDto = {
    name: '',
    description: '',
    parent_id: null,
  };

  // Para editar categoría
  categoriaEditando: Category | null = null;
  editData: Partial<CreateCategoryDto> = {
    name: '',
    description: '',
    parent_id: null,
  };

  // Mensajes
  errorMessage: string | null = null;
  isLoading = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  async cargarCategorias() {
    try {
      const [allCategories, mainCategories] = await Promise.all([
        firstValueFrom(this.categoryService.getAll()),
        firstValueFrom(this.categoryService.getMainCategories()),
      ]);

      this.categorias = allCategories;
      this.categoriasPrincipales = mainCategories;
      this.categoriaMap.clear();
      allCategories.forEach((c) => this.categoriaMap.set(c.id, c.name));
    } catch (err) {
      this.mostrarError('Error cargando categorías');
    }
  }

  get categoriasOrdenadas() {
    return [...this.categorias].sort((a, b) => {
      // Ordenar por categoría principal primero, luego por nombre
      if (a.parent_id === null && b.parent_id !== null) return -1;
      if (a.parent_id !== null && b.parent_id === null) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  getParentCategoryName(parentId: number | null | undefined): string {
    if (!parentId) return '';
    return this.categoriaMap.get(parentId) || '';
  }

  abrirModalCrear() {
    this.nuevaCategoria = {
      name: '',
      description: '',
      parent_id: null,
    };
    this.modalAbierto = 'crear';
    this.limpiarMensajes();
  }

  async crearCategoria() {
    if (!this.nuevaCategoria.name) {
      this.mostrarError('El nombre es obligatorio');
      return;
    }

    this.isLoading = true;

    try {
      await firstValueFrom(this.categoryService.create(this.nuevaCategoria));
      this.mostrarExito('Categoría creada correctamente');
      this.cargarCategorias();
      this.cerrarModal();
    } catch (err) {
      this.manejarError(err, 'creando categoría');
    } finally {
      this.isLoading = false;
    }
  }

  abrirModalEditar(category: Category) {
    this.categoriaEditando = category;
    this.editData = {
      name: category.name,
      description: category.description,
      parent_id: category.parent_id ?? null,
    };
    this.modalAbierto = 'editar';
    this.limpiarMensajes();
  }

  async guardarCambios() {
    if (!this.categoriaEditando) return;

    if (!this.editData.name) {
      this.mostrarError('El nombre es obligatorio');
      return;
    }

    this.isLoading = true;

    try {
      await firstValueFrom(
        this.categoryService.update(this.categoriaEditando.id, this.editData)
      );
      this.mostrarExito('Categoría actualizada correctamente');
      this.cargarCategorias();
      this.cerrarModal();
    } catch (err) {
      this.manejarError(err, 'actualizando categoría');
    } finally {
      this.isLoading = false;
    }
  }

  eliminarCategoria(category: Category) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar la categoría "${category.name}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06b6d4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.delete(category.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminada',
              text: `La categoría "${category.name}" fue eliminada correctamente.`,
              confirmButtonColor: '#06b6d4',
            });
            this.cargarCategorias();
          },
          error: (err) => {
            let errorMsg = `No se pudo eliminar la categoría "${category.name}".`;

            if (err.status === 400) {
              errorMsg =
                'No se puede eliminar una categoría que tiene subcategorías.';
            }

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMsg,
              confirmButtonColor: '#06b6d4',
            });
          },
        });
      }
    });
  }

  cerrarModal() {
    this.modalAbierto = null;
    this.categoriaEditando = null;
    this.limpiarMensajes();
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
    this.errorMessage = mensaje;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonColor: '#d33',
    });
  }

  private manejarError(err: any, accion: string) {
    if (err.status === 409) {
      this.mostrarError('Ya existe una categoría con ese nombre.');
    } else if (err.status === 400) {
      this.mostrarError('No se puede asignar una subcategoría como padre.');
    } else {
      this.mostrarError(`Error ${accion}.`);
    }
  }

  limpiarMensajes() {
    this.errorMessage = null;
  }
}
