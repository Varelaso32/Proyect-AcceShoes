import { Routes } from '@angular/router';
import { TxtInputComponent } from '../app/Shared/components/txt-input/txt-input.component';
import { BtnButtonComponent } from '../app/Shared/components/btn-button/btn-button.component';
import { ChatMessageComponent } from '../app/Shared/components/chat-message/chat-message.component';

export const routes: Routes = [
    { path: 'input', component: TxtInputComponent },
    { path: 'button', component: BtnButtonComponent },
    { path: 'chat', component: ChatMessageComponent },
    { path: '', redirectTo: 'input', pathMatch: 'full' }, // ruta por defecto
];
