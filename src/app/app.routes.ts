import { Routes } from '@angular/router';
import { HomeComponent } from '../app/Pages/home/home.component';
import { TxtInputComponent } from '../app/Shared/components/txt-input/txt-input.component';
import { ChatMessageComponent } from '../app/Shared/components/chat-message/chat-message.component';
import { LoginComponent } from '../app/Pages/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirección por defecto a Home
    { path: 'home', component: HomeComponent },
    { path: 'input', component: TxtInputComponent },
    { path: 'chat', component: ChatMessageComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'home' }, // Ruta comodín para rutas no válidas
];
