import { Routes } from '@angular/router';
import { TxtInputComponent } from '../app/Shared/components/txt-input/txt-input.component';
import { BtnButtonComponent } from '../app/Shared/components/btn-button/btn-button.component';

export const routes: Routes = [
    { path: 'input', component: TxtInputComponent },
    { path: 'button', component: BtnButtonComponent },
    { path: '', redirectTo: 'input', pathMatch: 'full' }, // ruta por defecto
];
