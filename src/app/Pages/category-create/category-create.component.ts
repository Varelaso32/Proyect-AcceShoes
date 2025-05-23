// category-create.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../Shared/services/category.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-create.component.html',
})
export class CategoryCreateComponent {
  name = '';
  description = '';
  parent_id: number | null = null;

  constructor(private categoryService: CategoryService, private router: Router) {}

  onSubmit() {
    const newCategory = {
      name: this.name,
      description: this.description,
      parent_id: this.parent_id || null
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: (category) => {
        console.log('Categoría creada:', category);
        this.router.navigate(['/all-categories']);
      },
      error: (error) => {
        console.error('Error al crear la categoría:', error);
      }
    });
  }
}
